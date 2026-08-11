package com.reservation.business.service;

import com.reservation.auth.dto.response.UserResponse;
import com.reservation.auth.entity.User;
import com.reservation.auth.mapper.UserMapper;
import com.reservation.auth.repository.UserRepository;
import com.reservation.business.dto.request.AcceptInvitationRequest;
import com.reservation.business.dto.request.InviteAdminRequest;
import com.reservation.business.entity.Business;
import com.reservation.business.entity.BusinessInvitation;
import com.reservation.business.entity.BusinessInvitationStatus;
import com.reservation.business.entity.BusinessMembership;
import com.reservation.business.entity.BusinessRole;
import com.reservation.business.repository.BusinessInvitationRepository;
import com.reservation.business.repository.BusinessMembershipRepository;
import com.reservation.common.exception.DuplicateResourceException;
import com.reservation.common.exception.ResourceNotFoundException;
import com.reservation.common.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BusinessInvitationServiceImpl
        implements BusinessInvitationService {

    private final BusinessInvitationRepository invitationRepository;
    private final BusinessMembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final BusinessContextService businessContextService;
    private final BusinessMembershipService businessMembershipService;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    @Transactional
    public void inviteAdmin(InviteAdminRequest request) {

        businessMembershipService.requireOwner();

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        Business business =
                businessContextService.getCurrentBusiness();

        User existingUser =
                userRepository.findByEmail(email)
                        .orElse(null);

        if (existingUser != null) {

            boolean alreadyMember =
                    membershipRepository
                            .findByUserAndBusiness(
                                    existingUser,
                                    business
                            )
                            .isPresent();

            if (alreadyMember) {
                throw new DuplicateResourceException(
                        "User is already a member of this business"
                );
            }
        }

        boolean pendingInvitationExists =
                invitationRepository
                        .existsByBusinessIdAndEmailAndStatus(
                                business.getId(),
                                email,
                                BusinessInvitationStatus.PENDING
                        );

        if (pendingInvitationExists) {
            throw new DuplicateResourceException(
                    "An invitation for this email is already pending"
            );
        }

        BusinessInvitation invitation =
                BusinessInvitation.builder()
                        .business(business)
                        .email(email)
                        .token(UUID.randomUUID().toString())
                        .role(BusinessRole.ADMIN)
                        .status(BusinessInvitationStatus.PENDING)
                        .expiresAt(
                                LocalDateTime.now().plusDays(2)
                        )
                        .build();

        invitationRepository.save(invitation);

        String invitationLink =
                frontendUrl
                        + "/accept-invitation?token="
                        + invitation.getToken();

        emailService.sendAdminInvitation(
                email,
                business.getName(),
                invitationLink
        );
    }

    @Override
    @Transactional
    public UserResponse acceptInvitation(
            AcceptInvitationRequest request
    ) {

        BusinessInvitation invitation =
                invitationRepository
                        .findByToken(request.getToken())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Business invitation",
                                        "token",
                                        request.getToken()
                                )
                        );

        if (invitation.getStatus()
                != BusinessInvitationStatus.PENDING) {

            throw new IllegalStateException(
                    "Invitation is no longer valid"
            );
        }

        if (invitation.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            invitation.setStatus(
                    BusinessInvitationStatus.EXPIRED
            );

            invitationRepository.save(invitation);

            throw new IllegalStateException(
                    "Invitation has expired"
            );
        }

        String email = invitation.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {

            throw new DuplicateResourceException(
                    "An account with this email already exists"
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(email)
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .build();

        user = userRepository.save(user);

        BusinessMembership membership =
                BusinessMembership.builder()
                        .user(user)
                        .business(invitation.getBusiness())
                        .role(BusinessRole.ADMIN)
                        .build();

        membershipRepository.save(membership);

        invitation.setStatus(
                BusinessInvitationStatus.ACCEPTED
        );

        invitation.setAcceptedAt(
                LocalDateTime.now()
        );

        invitationRepository.save(invitation);

        return userMapper.toResponse(user);
    }
}