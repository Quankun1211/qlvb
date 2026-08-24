package com.qlvb.mofa.dto.request;

import lombok.*;
import java.time.LocalDate;

import com.qlvb.mofa.dto.enums.AssignmentStatus;
import com.qlvb.mofa.dto.enums.IncomingAssignmentType;
import com.qlvb.mofa.dto.enums.IncomingStatus;
import com.qlvb.mofa.dto.enums.NotificationType;
import com.qlvb.mofa.dto.enums.WorkType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingDocumentSearchRequest {

    private String keyword;

    private String incomingNumber;

    private String documentNumber;

    private String summary;

    private String issuingAgency;

    private String documentType;

    private IncomingStatus status;

    private String urgencyLevel;

    private String securityLevel;

    private LocalDate fromDate;

    private LocalDate toDate;

    private Integer year;

    private IncomingAssignmentType assignmentType;

    private WorkType workType;

    private NotificationType notificationType;

    private AssignmentStatus assignmentStatus;
}