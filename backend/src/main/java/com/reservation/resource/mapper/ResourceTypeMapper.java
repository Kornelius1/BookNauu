package com.reservation.resource.mapper;

import com.reservation.resource.dto.request.CreateResourceTypeRequest;
import com.reservation.resource.dto.request.UpdateResourceTypeRequest;
import com.reservation.resource.dto.response.ResourceTypeResponse;
import com.reservation.resource.entity.ResourceType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ResourceTypeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "business", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ResourceType toEntity(CreateResourceTypeRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "business", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(
            UpdateResourceTypeRequest request,
            @MappingTarget ResourceType resourceType
    );

    @Mapping(target = "businessId", source = "business.id")
    ResourceTypeResponse toResponse(ResourceType resourceType);
}