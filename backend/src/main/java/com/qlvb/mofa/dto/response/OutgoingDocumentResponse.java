package com.qlvb.mofa.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class OutgoingDocumentResponse {
    private Long id;
    private String outgoingNumber; // Số đi
    private String referenceNumber; // Số KH (Số ký hiệu / Số tham chiếu)
    private LocalDate issueDate; // Ngày BH
    private String subject; // Trích yếu
    private String drafterName; // Cán bộ soạn thảo (draftedBy)
    private String signerName; // Người ký (signedBy)
    private List<String> recipientNames; // Nơi nhận (từ bảng outgoing_recipients)
    private String status;
}