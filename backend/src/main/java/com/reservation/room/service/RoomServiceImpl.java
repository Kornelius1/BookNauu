package com.reservation.room.service;

import com.reservation.common.exception.DuplicateResourceException;
import com.reservation.common.exception.ResourceNotFoundException;
import com.reservation.room.dto.request.CreateRoomRequest;
import com.reservation.room.dto.request.UpdateRoomRequest;
import com.reservation.room.dto.response.RoomResponse;
import com.reservation.room.entity.Room;
import com.reservation.room.entity.RoomStatus;
import com.reservation.room.mapper.RoomMapper;
import com.reservation.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

    @Override
    public RoomResponse create(CreateRoomRequest request) {

        if (roomRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Room",
                    "name",
                    request.getName()
            );
        }

        Room room = roomMapper.toEntity(request);

        room.setStatus(RoomStatus.AVAILABLE);

        Room savedRoom = roomRepository.save(room);

        return roomMapper.toResponse(savedRoom);
    }

    @Override
    public RoomResponse update(Long id, UpdateRoomRequest request) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room", "id", id));

        if (!room.getName().equals(request.getName())
                && roomRepository.existsByName(request.getName())) {

            throw new DuplicateResourceException(
                    "Room",
                    "name",
                    request.getName()
            );
        }

        roomMapper.updateEntity(request, room);

        Room updatedRoom = roomRepository.save(room);

        return roomMapper.toResponse(updatedRoom);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse getById(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room", "id", id));

        return roomMapper.toResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getAll() {

        return roomRepository.findAll()
                .stream()
                .map(roomMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room", "id", id));

        roomRepository.delete(room);
    }
}