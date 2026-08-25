package com.qlvb.mofa.dto.response;

import com.qlvb.mofa.dto.enums.DraftStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class DraftDocumentResponse {
    private Long id;
    private String subject; // Về việc
    private Long draftedById;
    private String draftedByName; // Người soạn (VD: Đỗ Văn Điển)
    private Long approvingLeaderId;
    private String approvingLeaderName; // Lãnh đạo ký duyệt (VD: Nguyễn Đăng Lâm)
    private LocalDate submittedAt; // Ngày trình
    private DraftStatus status; // Trạng thái
    private LocalDateTime createdAt;
}