package com.qlvb.mofa.dto.request;

import com.qlvb.mofa.dto.enums.DocumentClassification;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
public class WorkRecordCreateRequest {
    private String code; // Mã hồ sơ
    private String recordNumber; // Số hồ sơ
    private String name; // Tên hồ sơ
    private DocumentClassification type; // Loại hồ sơ
    private String description; // Nội dung
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate; // Ngày bắt đầu
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate; // Ngày kết thúc
    
    private String field; // Lĩnh vực
    
    private List<MemberAssignmentRequest> members; // Danh sách thành viên (Phụ trách, Phối hợp, Theo dõi)

    @Data
    public static class MemberAssignmentRequest {
        private Long userId;
        private Long unitId;
        private String role; // OWNER (PT), COLLABORATOR (PH), FOLLOWER (TD)
    }
}