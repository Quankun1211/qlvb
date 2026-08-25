package com.qlvb.mofa.service;

import com.qlvb.mofa.dto.request.WorkRecordCreateRequest;
import com.qlvb.mofa.dto.response.WorkRecordResponse;
import com.qlvb.mofa.entity.User;
import com.qlvb.mofa.entity.WorkRecord;
import com.qlvb.mofa.entity.WorkRecordMember;
import com.qlvb.mofa.repository.UserRepository;
import com.qlvb.mofa.repository.WorkRecordMemberRepository;
import com.qlvb.mofa.repository.WorkRecordRepository;
import com.qlvb.mofa.sercurity.SecurityUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkRecordService {

    private final WorkRecordRepository workRecordRepository;
    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;
    private final WorkRecordMemberRepository workRecordMemberRepository;

    public Page<WorkRecordResponse> getCreatedWorkRecords(Pageable pageable) {
        Long currentUserId = securityUtils.getCurrentUserId();
        return workRecordRepository.findWorkRecordsCreatedByUser(currentUserId, pageable)
                .map(this::toResponse);
    }

    private WorkRecordResponse toResponse(WorkRecord record) {
        java.util.List<String> owners = new java.util.ArrayList<>();
        java.util.List<String> collaborators = new java.util.ArrayList<>();
        java.util.List<String> followers = new java.util.ArrayList<>();

        return WorkRecordResponse.builder()
                .id(record.getId())
                .name(record.getName())
                .assignedAt(record.getAssignedAt())
                .dueAt(record.getDueAt())
                .creatorId(record.getCreatedBy() != null ? record.getCreatedBy().getId() : null)
                .creatorName(record.getCreatedBy() != null ? record.getCreatedBy().getFullName() : null)
                .ownerNames(owners)
                .collaboratorNames(collaborators)
                .followerNames(followers)
                .status(record.getStatus())
                .description(record.getDescription())
                .build();
    }

    @Transactional
    public Long createWorkRecord(WorkRecordCreateRequest request) {
        Long currentUserId = securityUtils.getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng hiện tại"));

        // Tạo mới hồ sơ công việc
        WorkRecord workRecord = WorkRecord.builder()
                .name(request.getName())
                .assignedAt(request.getStartDate() != null ? request.getStartDate().atStartOfDay() : java.time.LocalDateTime.now())
                .dueAt(request.getEndDate() != null ? request.getEndDate().atStartOfDay() : null)
                .createdBy(currentUser)
                .description(request.getDescription())
                .build();

        WorkRecord savedRecord = workRecordRepository.save(workRecord);

        if (request.getMembers() != null) {
            for (WorkRecordCreateRequest.MemberAssignmentRequest memberReq : request.getMembers()) {
                WorkRecordMember member = WorkRecordMember.builder()
                        .workRecord(savedRecord)
                        .user(memberReq.getUserId() != null ? userRepository.findById(memberReq.getUserId()).orElse(null) : null)
                        .role(com.qlvb.mofa.dto.enums.WorkRecordMemberRole.valueOf(memberReq.getRole()))
                        .build();
                workRecordMemberRepository.save(member);
            }
        }

        return savedRecord.getId();
    }
}