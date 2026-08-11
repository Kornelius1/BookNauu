package com.reservation.resource.service;

import com.reservation.resource.dto.request.CreateResourceTypeRequest;
import com.reservation.resource.dto.request.UpdateResourceTypeRequest;
import com.reservation.resource.dto.response.ResourceTypeResponse;

import java.util.List;

public interface ResourceTypeService {

    ResourceTypeResponse create(
            CreateResourceTypeRequest request
    );

    List<ResourceTypeResponse> getAll();

    ResourceTypeResponse getById(Long id);

    ResourceTypeResponse update(
            Long id,
            UpdateResourceTypeRequest request
    );

    void delete(Long id);
}