package com.reservation.auth.service;

import com.reservation.auth.dto.request.RegisterRequest;
import com.reservation.auth.dto.response.UserResponse;
import com.reservation.auth.entity.User;
import com.reservation.auth.entity.UserRole;
import com.reservation.auth.Mapper.UserMapper;
import com.reservation.auth.repository.UserRepository;
import com.reservation.common.exception.DuplicateResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse register(RegisterRequest request) {

        validateEmail(request.getEmail());

        User user = userMapper.toEntity(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(UserRole.CUSTOMER);

        user = userRepository.save(user);

        return userMapper.toResponse(user);
    }

    private void validateEmail(String email) {

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already exists");
        }

    }

}