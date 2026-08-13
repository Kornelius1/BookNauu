package com.reservation.business.service;

import com.reservation.auth.entity.User;
import com.reservation.business.entity.Business;
import com.reservation.business.entity.BusinessMembership;
import com.reservation.business.entity.BusinessRole;
import com.reservation.business.repository.BusinessMembershipRepository;
import com.reservation.common.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BusinessMembershipServiceImpl
        implements BusinessMembershipService {

    private final BusinessMembershipRepository membershipRepository;
    private final BusinessContextService businessContextService;

    @Override
    public BusinessMembership getCurrentMembership() {

        User currentUser =
                businessContextService.getCurrentUser();

        Business currentBusiness =
                businessContextService.getCurrentBusiness();

        return membershipRepository
                .findByUserAndBusiness(
                        currentUser,
                        currentBusiness
                )
                .orElseThrow(() ->
                        new AccessDeniedException(
                                "User is not a member of this business"
                        )
                );
    }

    @Override
    public void requireOwner() {

        BusinessMembership membership =
                getCurrentMembership();

        if (membership.getRole()
                != BusinessRole.OWNER) {

            throw new ForbiddenException(
                    "Only business owner can perform this action"
            );
        }
    }

    @Override
    public void requireAdmin() {

        BusinessMembership membership =
                getCurrentMembership();

        if (membership.getRole()
                != BusinessRole.ADMIN) {

            throw new AccessDeniedException(
                    "Only business admin can perform this action"
            );
        }
    }

    @Override
    public void requireOwnerOrAdmin() {

        BusinessMembership membership =
                getCurrentMembership();

        if (membership.getRole() != BusinessRole.OWNER
                && membership.getRole() != BusinessRole.ADMIN) {

            throw new AccessDeniedException(
                    "Only business owner or admin can perform this action"
            );
        }
    }

    @Override
    public boolean hasRole(BusinessRole role) {

        return getCurrentMembership()
                .getRole() == role;
    }
}