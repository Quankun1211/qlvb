package com.qlvb.mofa.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingDocumentWorkResponse {

    private Long id;
    private String workType;
    private String notificationType;
    private String status;
    private LocalDateTime assignedAt;
    private LocalDateTime dueAt;
    private String returnReason;

    private Long assignedById;
    private String assignedByName;

    private Long leadUserId;
    private String leadUserName;

    private Long leadUnitId;
    private String leadUnitName;
}