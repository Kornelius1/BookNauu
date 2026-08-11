package com.reservation.resource.service;

import com.reservation.business.entity.Business;
import com.reservation.business.service.BusinessContextService;
import com.reservation.business.service.BusinessMembershipService;
import com.reservation.common.exception.DuplicateResourceException;
import com.reservation.common.exception.ResourceNotFoundException;
import com.reservation.resource.dto.request.CreateResourceTypeRequest;
import com.reservation.resource.dto.request.UpdateResourceTypeRequest;
import com.reservation.resource.dto.response.ResourceTypeResponse;
import com.reservation.resource.entity.ResourceType;
import com.reservation.resource.mapper.ResourceTypeMapper;
import com.reservation.resource.repository.ResourceTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceTypeServiceImpl
        implements ResourceTypeService {

    private final ResourceTypeRepository resourceTypeRepository;
    private final ResourceTypeMapper resourceTypeMapper;

    private final BusinessContextService businessContextService;
    private final BusinessMembershipService businessMembershipService;

    @Override
    @Transactional
    public ResourceTypeResponse create(
            CreateResourceTypeRequest request
    ) {

        businessMembershipService.requireOwnerOrAdmin();

        Long businessId =
                businessContextService.getCurrentBusinessId();

        Business business =
                businessContextService.getCurrentBusiness();

        if (resourceTypeRepository.existsByBusinessIdAndName(
                businessId,
                request.getName()
        )) {
            throw new DuplicateResourceException(
                    "Resource type already exists in this business"
            );
        }

        ResourceType resourceType =
                resourceTypeMapper.toEntity(request);

        resourceType.setBusiness(business);

        resourceType =
                resourceTypeRepository.save(resourceType);

        return resourceTypeMapper.toResponse(resourceType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceTypeResponse> getAll() {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        return resourceTypeRepository
                .findByBusinessId(businessId)
                .stream()
                .map(resourceTypeMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceTypeResponse getById(Long id) {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        ResourceType resourceType =
                resourceTypeRepository
                        .findByIdAndBusinessId(
                                id,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resource type",
                                        "id",
                                        id
                                )
                        );

        return resourceTypeMapper.toResponse(resourceType);
    }

    @Override
    @Transactional
    public ResourceTypeResponse update(
            Long id,
            UpdateResourceTypeRequest request
    ) {

        businessMembershipService.requireOwnerOrAdmin();

        Long businessId =
                businessContextService.getCurrentBusinessId();

        ResourceType resourceType =
                resourceTypeRepository
                        .findByIdAndBusinessId(
                                id,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resource type",
                                        "id",
                                        id
                                )
                        );

        if (resourceTypeRepository
                .existsByBusinessIdAndNameAndIdNot(
                        businessId,
                        request.getName(),
                        id
                )) {

            throw new DuplicateResourceException(
                    "Resource type already exists in this business"
            );
        }

        resourceTypeMapper.updateEntity(
                request,
                resourceType
        );

        return resourceTypeMapper.toResponse(
                resourceTypeRepository.save(resourceType)
        );
    }

    @Override
    @Transactional
    public void delete(Long id) {

        businessMembershipService.requireOwnerOrAdmin();

        Long businessId =
                businessContextService.getCurrentBusinessId();

        ResourceType resourceType =
                resourceTypeRepository
                        .findByIdAndBusinessId(
                                id,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resource type",
                                        "id",
                                        id
                                )
                        );

        resourceTypeRepository.delete(resourceType);
    }
}