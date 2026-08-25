package com.qlvb.mofa.sercurity;

import com.qlvb.mofa.entity.User;
import com.qlvb.mofa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa được xác thực");
        }

        // Lấy username hoặc email từ Principal (phụ thuộc vào cấu hình JWT/UserDetailsService của bạn)
        String username = authentication.getName();

        // Tra cứu trong database để lấy ID chính xác của user
        User user = userRepository.findByUsername(username) // Hoặc findByEmail tùy thuộc vào cột định danh của bạn
                .orElseThrow(() -> khôngTìmThấyUserException(username));

        return user.getId();
    }

    private RuntimeException khôngTìmThấyUserException(String username) {
        return new RuntimeException("Không tìm thấy thông tin người dùng: " + username);
    }
}