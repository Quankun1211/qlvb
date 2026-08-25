package com.qlvb.mofa.dto.request;

import com.qlvb.mofa.dto.enums.SubmissionStatus;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionSearchRequest {

    private String keyword;

    private SubmissionStatus status;

    private Long departmentId;

    private Long draftedById;

    private LocalDate fromDate;

    private LocalDate toDate;

    private List<SubmissionStatus> statuses;
}