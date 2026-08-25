package com.qlvb.mofa.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class DraftDocumentCreateRequest {

    @NotNull
    private Long documentTypeId;

    @NotBlank
    private String subject;

    @Valid
    private List<RecipientRequest> recipients;

    @Data
    public static class RecipientRequest {
        @NotNull
        private Long userId;

        @NotBlank
        private String recipientType;
    }
}
