package com.reservation.business.service;

import com.reservation.auth.entity.User;
import com.reservation.auth.service.AuthService;
import com.reservation.business.entity.Business;
import com.reservation.business.entity.BusinessMembership;
import com.reservation.business.repository.BusinessMembershipRepository;
import com.reservation.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;

@Service
@RequiredArgsConstructor
public class BusinessContextServiceImpl
        implements BusinessContextService {

    private final AuthService authService;
    private final BusinessMembershipRepository businessMembershipRepository;

    @Override
    @Transactional(readOnly = true)
    public Business getCurrentBusiness() {

        User currentUser =
                authService.getCurrentUserEntity();

        BusinessMembership membership =
                businessMembershipRepository
                        .findByUserId(currentUser.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "BusinessMembership",
                                        "userId",
                                        currentUser.getId()
                                )
                        );

        return membership.getBusiness();
    }

    @Override
    @Transactional(readOnly = true)
    public BusinessMembership getCurrentMembership() {

        User currentUser =
                authService.getCurrentUserEntity();

        return businessMembershipRepository
                .findByUserId(currentUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "BusinessMembership",
                                "userId",
                                currentUser.getId()
                        )
                );
    }

    @Override
    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal() instanceof User)) {

            throw new AccessDeniedException(
                    "User is not authenticated"
            );
        }

        return (User) authentication.getPrincipal();
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCurrentBusinessId() {

        return getCurrentBusiness().getId();
    }
}