package com.reservation.business.mapper;

import com.reservation.business.dto.response.BusinessResponse;
import com.reservation.business.entity.Business;
import com.reservation.common.mapper.CentralMapperConfig;
import org.mapstruct.Mapper;

@Mapper(config = CentralMapperConfig.class)
public interface BusinessMapper {

    BusinessResponse toResponse(Business business);
}