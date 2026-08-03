package com.reservation.auth.Mapper;

import com.reservation.auth.dto.request.RegisterRequest;
import com.reservation.auth.dto.response.UserResponse;
import com.reservation.auth.entity.User;
import com.reservation.common.mapper.CentralMapperConfig;
import org.mapstruct.Mapper;

@Mapper(config = CentralMapperConfig.class)
public interface UserMapper {

    User toEntity(RegisterRequest request);

    UserResponse toResponse(User user);

}