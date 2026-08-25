package com.qlvb.mofa.dto.response;

import com.qlvb.mofa.dto.enums.SubmissionStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponse {

    private Long id;

    private String submissionNumber;

    private String subject;

    private Long draftedById;

    private String draftedByName;

    private LocalDate submittedAt;

    private Long departmentId;

    private String departmentName;

    private String target;

    private SubmissionStatus status;

    private LocalDateTime publishedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}