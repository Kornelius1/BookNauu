package com.reservation.resource.controller;

import com.reservation.common.response.ApiResponse;
import com.reservation.resource.dto.request.CreateResourceRequest;
import com.reservation.resource.dto.request.UpdateResourceRequest;
import com.reservation.resource.dto.response.ResourceResponse;
import com.reservation.resource.service.BookableResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class BookableResourceController {

    private final BookableResourceService resourceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ResourceResponse> create(
            @Valid @RequestBody CreateResourceRequest request
    ) {
        return ApiResponse.success(
                resourceService.create(request)
        );
    }

    @GetMapping
    public ApiResponse<List<ResourceResponse>> getAll() {
        return ApiResponse.success(
                resourceService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<ResourceResponse> getById(
            @PathVariable Long id
    ) {
        return ApiResponse.success(
                resourceService.getById(id)
        );
    }

    @GetMapping("/type/{resourceTypeId}")
    public ApiResponse<List<ResourceResponse>> getByType(
            @PathVariable Long resourceTypeId
    ) {
        return ApiResponse.success(
                resourceService.getByType(resourceTypeId)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<ResourceResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateResourceRequest request
    ) {
        return ApiResponse.success(
                resourceService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {
        resourceService.delete(id);
    }
}