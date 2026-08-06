package com.reservation.room.service;

import com.reservation.room.dto.request.CreateRoomRequest;
import com.reservation.room.dto.request.UpdateRoomRequest;
import com.reservation.room.dto.response.RoomResponse;

import java.util.List;

public interface RoomService {

    RoomResponse create(CreateRoomRequest request);

    RoomResponse update(Long id, UpdateRoomRequest request);

    RoomResponse getById(Long id);

    List<RoomResponse> getAll();

    void delete(Long id);
}