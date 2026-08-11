package com.reservation.resource.controller;

import com.reservation.common.response.ApiResponse;
import com.reservation.resource.dto.request.CreateResourceTypeRequest;
import com.reservation.resource.dto.request.UpdateResourceTypeRequest;
import com.reservation.resource.dto.response.ResourceTypeResponse;
import com.reservation.resource.service.ResourceTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resource-types")
@RequiredArgsConstructor
public class ResourceTypeController {

    private final ResourceTypeService resourceTypeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ResourceTypeResponse> create(
            @Valid @RequestBody CreateResourceTypeRequest request
    ) {
        return ApiResponse.success(
                resourceTypeService.create(request)
        );
    }

    @GetMapping
    public ApiResponse<List<ResourceTypeResponse>> getAll() {

        return ApiResponse.success(
                resourceTypeService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<ResourceTypeResponse> getById(
            @PathVariable Long id
    ) {
        return ApiResponse.success(
                resourceTypeService.getById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<ResourceTypeResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateResourceTypeRequest request
    ) {
        return ApiResponse.success(
                resourceTypeService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {
        resourceTypeService.delete(id);
    }
}