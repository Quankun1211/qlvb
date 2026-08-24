package com.qlvb.mofa.dto.response;

import com.qlvb.mofa.dto.enums.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private Long id;
    private String username;
    private String fullName;
    private String email;
    private UserRole role;
    private Byte status;
    private Long departmentId;
    private Long unitId;
}