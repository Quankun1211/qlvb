package com.qlvb.mofa.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingDocumentDetailResponse {

    private Long id;
    private Long documentId;

    private String incomingNumber;
    private String documentNumber;
    private String register;
    private String documentType;

    private LocalDate issuedDate;
    private LocalDate receivedDate;
    private LocalDateTime receivedAt;

    private Boolean paperAttached;
    private Boolean legalDocument;

    private String issuingAgency;
    private String summary;

    private LocalDate responseDeadline;
    private Integer responseDays;

    private String securityLevel;
    private String urgencyLevel;

    private String handlingUnit;
    private String status;
    private Boolean responseRequired;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<IncomingDocumentAttachmentResponse> attachments;
    private List<IncomingDocumentOpinionResponse> opinions;
    private List<IncomingDocumentWorkResponse> works;
    private List<IncomingDocumentHistoryResponse> histories;
}