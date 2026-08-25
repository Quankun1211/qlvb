package com.qlvb.mofa.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingDocumentResponse {

    private Long id;

    private Long documentId;

    private String incomingNumber;

    private String documentNumber;

    private String summary;

    private LocalDate receivedDate;

    private LocalDate dueAt;

    private String issuingAgency;

    private String handlingUnit;

    private String documentType;

    private String status;

    private Boolean responseRequired;

    private String securityLevel;

    private String urgencyLevel;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}