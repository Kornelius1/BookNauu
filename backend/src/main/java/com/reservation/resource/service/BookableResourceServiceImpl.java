package com.reservation.resource.service;

import com.reservation.business.entity.Business;
import com.reservation.business.service.BusinessContextService;
import com.reservation.business.service.BusinessMembershipService;
import com.reservation.common.exception.ResourceNotFoundException;
import com.reservation.resource.dto.request.CreateResourceRequest;
import com.reservation.resource.dto.request.UpdateResourceRequest;
import com.reservation.resource.dto.response.ResourceResponse;
import com.reservation.resource.entity.BookableResource;
import com.reservation.resource.entity.ResourceType;
import com.reservation.resource.mapper.ResourceMapper;
import com.reservation.resource.repository.BookableResourceRepository;
import com.reservation.resource.repository.ResourceTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookableResourceServiceImpl
        implements BookableResourceService {

    private final BookableResourceRepository resourceRepository;
    private final ResourceTypeRepository resourceTypeRepository;
    private final ResourceMapper resourceMapper;

    private final BusinessContextService businessContextService;
    private final BusinessMembershipService businessMembershipService;

    @Override
    @Transactional
    public ResourceResponse create(
            CreateResourceRequest request
    ) {

        businessMembershipService.requireOwnerOrAdmin();

        Long businessId =
                businessContextService.getCurrentBusinessId();

        Business business =
                businessContextService.getCurrentBusiness();

        ResourceType resourceType =
                resourceTypeRepository
                        .findByIdAndBusinessId(
                                request.getResourceTypeId(),
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resource type",
                                        "id",
                                        request.getResourceTypeId()
                                )
                        );

        BookableResource resource =
                resourceMapper.toEntity(request);

        resource.setBusiness(business);
        resource.setResourceType(resourceType);

        resource =
                resourceRepository.save(resource);

        return resourceMapper.toResponse(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> getAll() {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        return resourceRepository
                .findByBusinessId(businessId)
                .stream()
                .map(resourceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceResponse getById(Long id) {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        BookableResource resource =
                resourceRepository
                        .findByIdAndBusinessId(
                                id,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resource",
                                        "id",
                                        id
                                )
                        );

        return resourceMapper.toResponse(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> getByType(
            Long resourceTypeId
    ) {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        ResourceType resourceType =
                resourceTypeRepository
                        .findByIdAndBusinessId(
                                resourceTypeId,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resource type",
                                        "id",
                                        resourceTypeId
                                )
                        );

        return resourceRepository
                .findByBusinessIdAndResourceTypeId(
                        businessId,
                        resourceType.getId()
                )
                .stream()
                .map(resourceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ResourceResponse update(
            Long id,
            UpdateResourceRequest request
    ) {

        businessMembershipService.requireOwnerOrAdmin();

        Long businessId =
                businessContextService.getCurrentBusinessId();

        BookableResource resource =
                resourceRepository
                        .findByIdAndBusinessId(
                                id,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resource",
                                        "id",
                                        id
                                )
                        );

        if (request.getResourceTypeId() != null) {

            ResourceType resourceType =
                    resourceTypeRepository
                            .findByIdAndBusinessId(
                                    request.getResourceTypeId(),
                                    businessId
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Resource type",
                                            "id",
                                            request.getResourceTypeId()
                                    )
                            );

            resource.setResourceType(resourceType);
        }

        resourceMapper.updateEntity(
                request,
                resource
        );

        resource =
                resourceRepository.save(resource);

        return resourceMapper.toResponse(resource);
    }

    @Override
    @Transactional
    public void delete(Long id) {

        businessMembershipService.requireOwnerOrAdmin();

        Long businessId =
                businessContextService.getCurrentBusinessId();

        BookableResource resource =
                resourceRepository
                        .findByIdAndBusinessId(
                                id,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resource",
                                        "id",
                                        id
                                )
                        );

        resourceRepository.delete(resource);
    }
}