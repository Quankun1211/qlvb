package com.qlvb.mofa.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FrequentGroupMemberResponse {

    private Long id;

    private Long userId;

    private String userName;

    private Long departmentId;

    private String departmentName;

    private Long unitId;

    private String unitName;
}