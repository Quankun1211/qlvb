package com.qlvb.mofa.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OutgoingDocumentDetailResponse {
    private Long id;
    private String outgoingNumber; // Số đi
    private String referenceNumber; // Số ký hiệu
    private String documentType; // Loại văn bản
    private LocalDate issueDate; // Ngày ban hành
    private String securityLevel; // Độ mật
    private String urgencyLevel; // Độ khẩn
    private String subject; // Trích yếu
    private String signerName; // Người ký
    private String signerPosition; // Chức vụ người ký
    private String drafterName; // Người soạn
    private String status; // Trạng thái
    private String bookName; // Sổ công văn / Sổ công điện đi
    private String departmentName; // PB/Đơn vị soạn
    private Integer pageCount; // Số trang
    private String sourceDocumentTitle;
    
    // Các tệp toàn văn đính kèm
    private List<AttachmentDto> attachments;

    // Danh sách nơi nhận
    private List<RecipientDto> recipients;

    @Data
    @Builder
    public static class AttachmentDto {
        private String fileName;
        private String filePath;
    }

    @Data
    @Builder
    public static class RecipientDto {
        private String senderName;
        private String senderDepartment;
        private LocalDateTime sentAt;
        private String recipientName;
        private LocalDateTime receivedAt;
        private String deliveryMethod;
        private String deliveryStatus;
    }
}