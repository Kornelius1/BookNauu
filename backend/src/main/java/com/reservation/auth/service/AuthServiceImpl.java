package com.reservation.auth.service;

import com.reservation.auth.dto.request.LoginRequest;
import com.reservation.auth.dto.request.RegisterRequest;
import com.reservation.auth.dto.response.BusinessContextResponse;
import com.reservation.auth.dto.response.LoginResponse;
import com.reservation.auth.dto.response.RegisterResponse;
import com.reservation.auth.entity.User;
import com.reservation.auth.mapper.UserMapper;
import com.reservation.auth.repository.UserRepository;
import com.reservation.business.entity.*;
import com.reservation.business.mapper.BusinessMapper;
import com.reservation.business.repository.BusinessMembershipRepository;
import com.reservation.business.repository.BusinessOperatingHoursRepository;
import com.reservation.business.repository.BusinessRepository;
import com.reservation.common.exception.DuplicateResourceException;
import com.reservation.common.exception.ResourceNotFoundException;
import com.reservation.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.reservation.auth.dto.response.CurrentUserResponse;
import org.springframework.security.access.AccessDeniedException;

import java.time.DayOfWeek;
import java.time.LocalTime;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;

    private final BusinessRepository businessRepository;

    private final BusinessMembershipRepository businessMembershipRepository;

    private final BusinessMapper businessMapper;

    private final BusinessOperatingHoursRepository businessOperatingHoursRepository;


    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        validateEmail(request.getEmail());


        // Create User
        User user = userMapper.toEntity(request);

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );


        user = userRepository.save(user);


        // Create Business
        Business business = new Business();

        business.setName(request.getBusinessName());

        business.setSlug(
                generateUniqueSlug(request.getBusinessName())
        );

        business.setStatus(BusinessStatus.ACTIVE);

        business = businessRepository.save(business);


        // Create OWNER membership
        BusinessMembership membership =
                new BusinessMembership();

        membership.setUser(user);

        membership.setBusiness(business);

        membership.setRole(BusinessRole.OWNER);

        businessMembershipRepository.save(membership);

        createDefaultOperatingHours(business);

        // Response
        return RegisterResponse.builder()
                .user(userMapper.toResponse(user))
                .business(businessMapper.toResponse(business))
                .build();
    }


    @Override
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User",
                                "email",
                                request.getEmail()
                        )
                );

        BusinessMembership membership =
                businessMembershipRepository
                        .findByUser(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Business membership",
                                        "user",
                                        user.getEmail()
                                )
                        );

        Business business = membership.getBusiness();

        String token = jwtService.generateToken(
                user,
                business.getId(),
                membership.getRole()
        );

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .business(
                        BusinessContextResponse.builder()
                                .businessId(business.getId())
                                .businessName(business.getName())
                                .businessSlug(business.getSlug())
                                .role(membership.getRole())
                                .build()
                )
                .build();
    }

    @Override
    public CurrentUserResponse getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();


        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User",
                                "email",
                                email
                        )
                );


        BusinessMembership membership =
                businessMembershipRepository
                        .findByUser(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Business membership",
                                        "user",
                                        user.getEmail()
                                )
                        );


        Business business = membership.getBusiness();


        return CurrentUserResponse.builder()
                .user(userMapper.toResponse(user))
                .business(
                        BusinessContextResponse.builder()
                                .businessId(business.getId())
                                .businessName(business.getName())
                                .businessSlug(business.getSlug())
                                .role(membership.getRole())
                                .build()
                )
                .build();
    }


    @Override
    public User getCurrentUserEntity() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        System.out.println("=== CURRENT USER ENTITY ===");
        System.out.println("authentication = " + authentication);

        if (authentication == null
                || !(authentication.getPrincipal() instanceof User)) {

            throw new AccessDeniedException(
                    "User is not authenticated"
            );
        }

        return (User) authentication.getPrincipal();
    }


    private void validateEmail(String email) {

        if (userRepository.existsByEmail(email)) {

            throw new DuplicateResourceException(
                    "Email already exists"
            );
        }
    }

    private void createDefaultOperatingHours(
            Business business
    ) {

        for (DayOfWeek day : DayOfWeek.values()) {

            BusinessOperatingHours operatingHours =
                    new BusinessOperatingHours();

            operatingHours.setBusiness(business);
            operatingHours.setDayOfWeek(day);

            if (day == DayOfWeek.SUNDAY) {

                operatingHours.setClosed(true);
                operatingHours.setOpenTime(null);
                operatingHours.setCloseTime(null);

            } else {

                operatingHours.setClosed(false);
                operatingHours.setOpenTime(
                        LocalTime.of(14, 0)
                );
                operatingHours.setCloseTime(
                        LocalTime.of(22, 0)
                );
            }

            businessOperatingHoursRepository.save(
                    operatingHours
            );
        }
    }


    private String generateUniqueSlug(String businessName) {

        String baseSlug = businessName
                .toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");

        if (baseSlug.isBlank()) {
            baseSlug = "business";
        }

        String slug = baseSlug;

        int counter = 2;

        while (businessRepository.existsBySlug(slug)) {

            slug = baseSlug + "-" + counter;

            counter++;
        }

        return slug;
    }
}