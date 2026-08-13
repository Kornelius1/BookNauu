package com.reservation.business.service;

import com.reservation.business.dto.request.UpdateOperatingHoursRequest;
import com.reservation.business.dto.response.OperatingHoursResponse;

import java.util.List;

public interface BusinessOperatingHoursService {

    List<OperatingHoursResponse> getOperatingHours();

    OperatingHoursResponse updateOperatingHours(
            UpdateOperatingHoursRequest request
    );
}