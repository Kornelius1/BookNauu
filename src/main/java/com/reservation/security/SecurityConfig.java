package com.reservation.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http

                // REST API tidak menggunakan CSRF
                .csrf(csrf -> csrf.disable())

                // Tidak menggunakan Session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorization
                .authorizeHttpRequests(auth -> auth

                        // Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Authentication API
                        .requestMatchers("/api/v1/auth/**")
                        .permitAll()

                        // Semua endpoint lain harus login
                        .anyRequest()
                        .authenticated()
                )

                // Matikan login bawaan Spring
                .formLogin(form -> form.disable())

                // Matikan HTTP Basic
                .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

}