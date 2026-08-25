package com.qlvb.mofa.dto.response;

import com.qlvb.mofa.dto.enums.WorkRecordStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class WorkRecordResponse {
    private Long id;
    private String name; 
    private LocalDateTime assignedAt; 
    private LocalDateTime dueAt; 
    private Long creatorId;
    private String creatorName;
    private List<String> ownerNames; 
    private List<String> collaboratorNames; 
    private List<String> followerNames; 
    private WorkRecordStatus status; 
    private String description;
}