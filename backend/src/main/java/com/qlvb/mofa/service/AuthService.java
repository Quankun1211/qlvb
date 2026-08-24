package com.qlvb.mofa.service;

import com.qlvb.mofa.config.JwtTokenUtil;
import com.qlvb.mofa.dto.request.LoginRequest;
import com.qlvb.mofa.dto.response.LoginResponse;
import com.qlvb.mofa.entity.User;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;

    public LoginResponse login(LoginRequest request) {

        // 1. Kiểm tra username + password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 2. Lấy user sau khi authenticate thành công
        User user = userService.findActiveByUsername(
                request.getUsername()
        );

        // 3. Generate token
        String accessToken =
                jwtTokenUtil.generateAccessToken(user);

        String refreshToken =
                jwtTokenUtil.generateRefreshToken(user);

        // 4. Response
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userService.toResponse(user))
                .build();
    }
}