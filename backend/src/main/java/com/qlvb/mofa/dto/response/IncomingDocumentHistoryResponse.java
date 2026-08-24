package com.qlvb.mofa.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingDocumentHistoryResponse {

    private Long id;
    private LocalDateTime createdAt;
    private String action;
    private String oldStatus;
    private String newStatus;
    private String content;
    private Long processedById;
    private String processedByName;
}