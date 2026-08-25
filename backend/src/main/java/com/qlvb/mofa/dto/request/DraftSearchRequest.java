package com.qlvb.mofa.dto.request;

import com.qlvb.mofa.dto.enums.DraftStatus;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
public class DraftSearchRequest {
    private String keyword;
    private DraftStatus status;
    private Long draftedById;
    private Long approvingLeaderId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fromDate;
    private List<DraftStatus> statuses;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate toDate;
}