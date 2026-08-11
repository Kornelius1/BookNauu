package com.reservation.resource.service;

import com.reservation.resource.dto.request.CreateResourceRequest;
import com.reservation.resource.dto.request.UpdateResourceRequest;
import com.reservation.resource.dto.response.ResourceResponse;

import java.util.List;

public interface BookableResourceService {

    ResourceResponse create(
            CreateResourceRequest request
    );

    List<ResourceResponse> getAll();

    ResourceResponse getById(Long id);

    List<ResourceResponse> getByType(Long resourceTypeId);

    ResourceResponse update(
            Long id,
            UpdateResourceRequest request
    );

    void delete(Long id);
}