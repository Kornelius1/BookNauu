package com.reservation.resource.mapper;

import com.reservation.resource.dto.request.CreateResourceRequest;
import com.reservation.resource.dto.request.UpdateResourceRequest;
import com.reservation.resource.dto.response.ResourceResponse;
import com.reservation.resource.entity.BookableResource;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ResourceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "business", ignore = true)
    @Mapping(target = "resourceType", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    BookableResource toEntity(CreateResourceRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "business", ignore = true)
    @Mapping(target = "resourceType", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(
            UpdateResourceRequest request,
            @MappingTarget BookableResource resource
    );

    @Mapping(target = "businessId", source = "business.id")
    @Mapping(target = "resourceTypeId", source = "resourceType.id")
    @Mapping(target = "resourceTypeName", source = "resourceType.name")
    ResourceResponse toResponse(BookableResource resource);
}