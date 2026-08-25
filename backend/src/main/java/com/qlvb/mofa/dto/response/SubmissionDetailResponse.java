package com.qlvb.mofa.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SubmissionDetailResponse {

    private Long id;
    private String submissionNumber;
    private String subject;
    private Long draftedById;
    private String draftedByName;
    private Long departmentId;
    private String departmentName;
    private String target;
    private String status;
    private LocalDate submittedAt;
    private LocalDateTime publishedAt;
    
    private DocumentInfoResponse document;
    private List<AttachmentResponse> attachments;
    private List<SubmissionProcessResponse> processes;

    @Data
    @Builder
    public static class DocumentInfoResponse {
        private Long id;
        private String officialSymbol;
        private String incomingNumber;
        private String docTypeName;
        private LocalDate issuedDate;
        private LocalDateTime arrivalDate;
        private String issuingAgencyName;
        private String receivingAgencyName;
        private String summary;
        private Integer retentionTime;
        private Boolean isLegalDocument;
        private String urgencyLevel;
        private String securityLevel;
    }

    @Data
    @Builder
    public static class AttachmentResponse {
        private Long id;
        private String fileName;
        private String fileUrl;
    }

    @Data
    @Builder
    public static class SubmissionProcessResponse {
        private LocalDateTime time;
        private String content;
        private String actorName;
        private String unitName;
    }
}