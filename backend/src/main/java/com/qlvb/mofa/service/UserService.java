package com.qlvb.mofa.service;

import com.qlvb.mofa.dto.response.UserResponse;
import com.qlvb.mofa.entity.User;
import com.qlvb.mofa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy người dùng: " + username
                        )
                );
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy người dùng: " + email
                        )
                );
    }

    @Transactional(readOnly = true)
    public User findActiveByUsername(String username) {
        User user = findByUsername(username);

        if (user.getStatus() == null || user.getStatus() != 1) {
            throw new RuntimeException("Tài khoản đã bị khóa hoặc không hoạt động");
        }

        return user;
    }

    public UserResponse toResponse(User user) {

        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .departmentId(
                        user.getDepartment() != null
                                ? user.getDepartment().getId()
                                : null
                )
                .unitId(
                        user.getUnit() != null
                                ? user.getUnit().getId()
                                : null
                )
                .build();
    }
}