package com.qlvb.mofa.dto.response;

import com.qlvb.mofa.dto.enums.WorkStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class WorkResponse {
    private Long id;
    private String name;
    private String incomingNumber; // Số đến của văn bản đến
    private String documentNumber; // Số ký hiệu của văn bản đến
    private LocalDateTime dueAt; 
    private LocalDateTime assignedAt; 
    private String assignerName; 
    private List<String> assigneeNames; 
    private List<String> collaboratorNames; 
    private WorkStatus status; 
    private String description;
}