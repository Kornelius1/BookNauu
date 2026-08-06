package com.reservation.room.mapper;

import com.reservation.common.mapper.CentralMapperConfig;
import com.reservation.room.dto.request.CreateRoomRequest;
import com.reservation.room.dto.request.UpdateRoomRequest;
import com.reservation.room.dto.response.RoomResponse;
import com.reservation.room.entity.Room;
import org.mapstruct.*;

@Mapper(config = CentralMapperConfig.class)
public interface RoomMapper {

    /**
     * Mapping CreateRoomRequest -> Room
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    Room toEntity(CreateRoomRequest request);

    /**
     * Mapping Room -> RoomResponse
     */
    RoomResponse toResponse(Room room);

    /**
     * Update entity menggunakan data dari UpdateRoomRequest
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(UpdateRoomRequest request, @MappingTarget Room room);
}