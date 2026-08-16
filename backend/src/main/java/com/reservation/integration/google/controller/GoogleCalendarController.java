package com.reservation.integration.google.controller;

import com.reservation.auth.entity.User;
import com.reservation.business.entity.Business;
import com.reservation.business.service.BusinessContextService;
import com.reservation.integration.google.config.GoogleCalendarProperties;
import com.reservation.integration.google.dto.response.GoogleCalendarStatusResponse;
import com.reservation.integration.google.dto.response.GoogleCalendarConnectResponse;
import com.reservation.integration.google.service.GoogleCalendarOAuthService;
import com.reservation.integration.google.service.GoogleCalendarOAuthStateService;
import com.reservation.integration.google.service.GoogleCalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.reservation.integration.google.entity.GoogleCalendarOAuthState;

@RestController
@RequestMapping("/api/v1/integrations/google/calendar")
@RequiredArgsConstructor
public class GoogleCalendarController {

    private final GoogleCalendarOAuthService googleCalendarOAuthService;

    private final GoogleCalendarService googleCalendarService;

    private final GoogleCalendarProperties googleCalendarProperties;

    private final BusinessContextService businessContextService;

    private final GoogleCalendarOAuthStateService googleCalendarOAuthStateService;


    @GetMapping("/connect")
    public ResponseEntity<GoogleCalendarConnectResponse> connect() {

        Business business =
                businessContextService.getCurrentBusiness();

        GoogleCalendarOAuthState oauthState =
                googleCalendarOAuthStateService.create(
                        business
                );

        String authorizationUrl =
                googleCalendarOAuthService.buildAuthorizationUrl(
                        oauthState.getState()
                );

        return ResponseEntity.ok(
                new GoogleCalendarConnectResponse(
                        authorizationUrl
                )
        );
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(

            @RequestHeader(
                    value = "X-Goog-Channel-ID",
                    required = false
            )
            String channelId,

            @RequestHeader(
                    value = "X-Goog-Resource-ID",
                    required = false
            )
            String resourceId,

            @RequestHeader(
                    value = "X-Goog-Resource-State",
                    required = false
            )
            String resourceState
    ) {

        if (channelId == null || channelId.isBlank()) {
            return ResponseEntity.ok().build();
        }

        googleCalendarService.handleCalendarWebhook(
                channelId,
                resourceId,
                resourceState
        );

        return ResponseEntity.ok().build();
    }


    @GetMapping("/callback")
    public ResponseEntity<Void> callback(

            @RequestParam(
                    value = "code",
                    required = false
            )
            String code,

            @RequestParam(
                    value = "state",
                    required = false
            )
            String state,

            @RequestParam(
                    value = "error",
                    required = false
            )
            String error
    ) {

        /*
         * User membatalkan Google OAuth.
         */
        if (error != null && !error.isBlank()) {

            return redirectFailure(
                    "denied"
            );
        }

        /*
         * State wajib ada.
         */
        if (state == null || state.isBlank()) {

            return redirectFailure(
                    "invalid_state"
            );
        }

        /*
         * Code wajib ada.
         */
        if (code == null || code.isBlank()) {

            return redirectFailure(
                    "missing_code"
            );
        }

        try {

            /*
             * Validasi + consume state.
             *
             * Dari state ini kita mendapatkan
             * business yang benar-benar memulai OAuth.
             */
            GoogleCalendarOAuthState oauthState =
                    googleCalendarOAuthStateService
                            .consume(state);

            Long businessId =
                    oauthState
                            .getBusiness()
                            .getId();

            /*
             * Baru setelah state valid,
             * proses Google OAuth.
             */
            googleCalendarOAuthService.handleCallback(
                    code,
                    businessId
            );

            return ResponseEntity
                    .status(302)
                    .header(
                            "Location",
                            googleCalendarProperties
                                    .getFrontendUrl()
                                    + "/settings"
                    )
                    .build();

        } catch (IllegalStateException e) {
            return redirectFailure(
                    "oauth_failed"
            );
        }
    }

    @GetMapping("/status")
    public ResponseEntity<GoogleCalendarStatusResponse> status() {

        Business business =
                businessContextService.getCurrentBusiness();

        return ResponseEntity.ok(
                googleCalendarService.getConnectionStatus(
                        business.getId()
                )
        );
    }


    @DeleteMapping("/disconnect")
    public ResponseEntity<Void> disconnect() {

        Business business =
                businessContextService.getCurrentBusiness();

        googleCalendarService.disconnect(
                business.getId()
        );

        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<Void> redirectFailure(
            String reason
    ) {

        return ResponseEntity
                .status(302)
                .header(
                        "Location",
                        googleCalendarProperties
                                .getFrontendUrl()
                                + "/settings?googleCalendar="
                                + reason
                )
                .build();
    }
}