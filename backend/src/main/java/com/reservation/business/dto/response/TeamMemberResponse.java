package com.reservation.business.dto.response;

import com.reservation.business.entity.BusinessRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TeamMemberResponse {

    private Long userId;

    private String fullName;

    private String email;

    private BusinessRole role;
}