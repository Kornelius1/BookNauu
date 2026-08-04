package com.reservation.auth.mapper;

import com.reservation.auth.dto.request.RegisterRequest;
import com.reservation.auth.dto.response.UserResponse;
import com.reservation.auth.entity.User;
import com.reservation.common.mapper.CentralMapperConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = CentralMapperConfig.class)
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    User toEntity(RegisterRequest request);

    UserResponse toResponse(User user);

}