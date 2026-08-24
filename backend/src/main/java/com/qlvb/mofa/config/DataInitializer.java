package com.qlvb.mofa.config;

import com.qlvb.mofa.entity.User;
import com.qlvb.mofa.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initUsersPassword() {
        return args -> {

            String defaultPassword = "123456";
            String passwordHash = passwordEncoder.encode(defaultPassword);

            var users = userRepository.findAll();

            for (User user : users) {
                user.setPasswordHash(passwordHash);
            }

            userRepository.saveAll(users);
        };
    }
}