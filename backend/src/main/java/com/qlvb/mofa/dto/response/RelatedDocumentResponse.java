package com.qlvb.mofa.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelatedDocumentResponse {

    private Long id;

    private String documentNumber;

    private String summary;

    private String issuingAgency;
}