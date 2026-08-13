package com.reservation.security.service;

import com.reservation.auth.entity.User;
import com.reservation.auth.repository.UserRepository;
import com.reservation.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {

        System.out.println("=== AUTH EMAIL ===");
        System.out.println("email = [" + email + "]");
        System.out.println("length = " + email.length());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User",
                                "email",
                                email
                        ));

        return user;
    }
}