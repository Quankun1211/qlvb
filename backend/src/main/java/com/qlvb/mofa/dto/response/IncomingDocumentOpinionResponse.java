package com.qlvb.mofa.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingDocumentOpinionResponse {

    private Long id;

    private String userName;

    private String content;

    private LocalDateTime createdAt;
}