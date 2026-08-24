package com.qlvb.mofa.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingDocumentAttachmentResponse {

    private Long id;

    private String fileName;

    private String objectName;

    private String fileUrl;

    private String fileType;

    private Long fileSize;

    private Boolean signed;
}