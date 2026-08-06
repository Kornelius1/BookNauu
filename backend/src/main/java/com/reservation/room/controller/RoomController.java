package com.reservation.room.controller;

import com.reservation.common.response.ApiResponse;
import com.reservation.room.dto.request.CreateRoomRequest;
import com.reservation.room.dto.request.UpdateRoomRequest;
import com.reservation.room.dto.response.RoomResponse;
import com.reservation.room.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoomResponse> create(
            @Valid @RequestBody CreateRoomRequest request
    ) {

        return ApiResponse.success(
                "Room created successfully",
                roomService.create(request)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoomResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoomRequest request
    ) {

        return ApiResponse.success(
                "Room updated successfully",
                roomService.update(id, request)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    public ApiResponse<RoomResponse> getById(
            @PathVariable Long id
    ) {

        return ApiResponse.success(
                roomService.getById(id)
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    public ApiResponse<List<RoomResponse>> getAll() {

        return ApiResponse.success(
                roomService.getAll()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {

        roomService.delete(id);

        return ApiResponse.success("Room deleted successfully");
    }
}