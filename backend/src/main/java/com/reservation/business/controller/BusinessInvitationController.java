package com.reservation.business.controller;

import com.reservation.auth.dto.response.UserResponse;
import com.reservation.business.dto.request.AcceptInvitationRequest;
import com.reservation.business.dto.request.InviteAdminRequest;
import com.reservation.business.service.BusinessInvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/business/team/invitations")
@RequiredArgsConstructor
public class BusinessInvitationController {

    private final BusinessInvitationService businessInvitationService;

    @PostMapping
    public ResponseEntity<Void> inviteAdmin(
            @Valid @RequestBody InviteAdminRequest request
    ) {

        businessInvitationService.inviteAdmin(request);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept")
    public ResponseEntity<UserResponse> acceptInvitation(
            @Valid @RequestBody AcceptInvitationRequest request
    ) {

        UserResponse response =
                businessInvitationService
                        .acceptInvitation(request);

        return ResponseEntity.ok(response);
    }
}