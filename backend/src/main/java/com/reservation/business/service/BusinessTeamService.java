package com.reservation.business.service;

import com.reservation.business.dto.response.TeamMemberResponse;

import java.util.List;

public interface BusinessTeamService {

    List<TeamMemberResponse> getTeamMembers();

    void removeMember(Long userId);
}