package com.reservation.business.service;

import com.reservation.business.dto.request.UpdateOperatingHoursRequest;
import com.reservation.business.dto.response.OperatingHoursResponse;
import com.reservation.business.entity.Business;
import com.reservation.business.entity.BusinessOperatingHours;
import com.reservation.business.repository.BusinessOperatingHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusinessOperatingHoursServiceImpl
        implements BusinessOperatingHoursService {

    private final BusinessOperatingHoursRepository
            operatingHoursRepository;

    private final BusinessContextService
            businessContextService;

    private final BusinessMembershipService
            businessMembershipService;


    @Override
    @Transactional(readOnly = true)
    public List<OperatingHoursResponse> getOperatingHours() {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        return operatingHoursRepository
                .findByBusinessIdOrderByDayOfWeek(businessId)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    @Override
    @Transactional
    public OperatingHoursResponse updateOperatingHours(
            UpdateOperatingHoursRequest request
    ) {

        businessMembershipService.requireOwner();

        Long businessId =
                businessContextService.getCurrentBusinessId();

        BusinessOperatingHours operatingHours =
                operatingHoursRepository
                        .findByBusinessIdAndDayOfWeek(
                                businessId,
                                request.getDayOfWeek()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Operating hours not found for "
                                                + request.getDayOfWeek()
                                )
                        );

        validateOperatingHours(request);

        operatingHours.setClosed(
                request.getClosed()
        );

        if (request.getClosed()) {

            operatingHours.setOpenTime(null);
            operatingHours.setCloseTime(null);

        } else {

            operatingHours.setOpenTime(
                    request.getOpenTime()
            );

            operatingHours.setCloseTime(
                    request.getCloseTime()
            );
        }

        return toResponse(
                operatingHoursRepository.save(
                        operatingHours
                )
        );
    }


    private void validateOperatingHours(
            UpdateOperatingHoursRequest request
    ) {

        if (request.getClosed()) {
            return;
        }

        if (request.getOpenTime() == null
                || request.getCloseTime() == null) {

            throw new IllegalArgumentException(
                    "Open time and close time are required "
                            + "when business is open."
            );
        }

        if (!request.getOpenTime().isBefore(
                request.getCloseTime()
        )) {

            throw new IllegalArgumentException(
                    "Open time must be before close time."
            );
        }
    }


    private OperatingHoursResponse toResponse(
            BusinessOperatingHours operatingHours
    ) {

        return OperatingHoursResponse.builder()
                .id(operatingHours.getId())
                .dayOfWeek(
                        operatingHours.getDayOfWeek()
                )
                .openTime(
                        operatingHours.getOpenTime()
                )
                .closeTime(
                        operatingHours.getCloseTime()
                )
                .closed(
                        operatingHours.isClosed()
                )
                .build();
    }
}