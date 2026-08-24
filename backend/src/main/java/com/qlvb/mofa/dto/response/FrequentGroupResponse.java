package com.qlvb.mofa.dto.response;

import com.qlvb.mofa.dto.enums.DocumentClassification;
import com.qlvb.mofa.dto.enums.GroupType;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FrequentGroupResponse {

    private Long id;

    private String name;

    private String shortName;

    private String description;

    private DocumentClassification documentClassification;

    private GroupType groupType;

    private Byte status;

    private Long createdById;

    private String createdByName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<FrequentGroupMemberResponse> members;
}