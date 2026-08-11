package com.reservation.business.service;

import com.reservation.business.dto.response.TeamMemberResponse;
import com.reservation.business.entity.Business;
import com.reservation.business.entity.BusinessMembership;
import com.reservation.business.entity.BusinessRole;
import com.reservation.business.repository.BusinessMembershipRepository;
import com.reservation.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusinessTeamServiceImpl
        implements BusinessTeamService {

    private final BusinessMembershipRepository membershipRepository;
    private final BusinessContextService businessContextService;
    private final BusinessMembershipService businessMembershipService;

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers() {

        Business business =
                businessContextService.getCurrentBusiness();

        return membershipRepository
                .findByBusiness(business)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void removeMember(Long userId) {

        businessMembershipService.requireOwner();

        Business business =
                businessContextService.getCurrentBusiness();

        BusinessMembership membership =
                membershipRepository
                        .findByUserIdAndBusinessId(
                                userId,
                                business.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Business membership",
                                        "userId",
                                        userId
                                )
                        );

        if (membership.getRole() == BusinessRole.OWNER) {
            throw new AccessDeniedException(
                    "Owner cannot be removed"
            );
        }

        membershipRepository.delete(membership);
    }

    private TeamMemberResponse toResponse(
            BusinessMembership membership
    ) {

        return TeamMemberResponse.builder()
                .userId(membership.getUser().getId())
                .fullName(membership.getUser().getFullName())
                .email(membership.getUser().getEmail())
                .role(membership.getRole())
                .build();
    }
}