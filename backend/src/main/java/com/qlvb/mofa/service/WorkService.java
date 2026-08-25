package com.qlvb.mofa.service;

import com.qlvb.mofa.dto.response.WorkResponse;
import com.qlvb.mofa.entity.Work;
import com.qlvb.mofa.repository.WorkAssigneeRepository;
import com.qlvb.mofa.repository.WorkRepository;
import com.qlvb.mofa.sercurity.SecurityUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkService {

    private final WorkRepository workRepository;
    private final SecurityUtils securityUtils;
    private final WorkAssigneeRepository workAssigneeRepository; // Giả định bạn đã tạo repo này

    public Page<WorkResponse> getWorksAssignedToUser(Long userId, Pageable pageable) {
        return workRepository.findWorksAssignedToUser(userId, pageable)
                .map(this::toResponse);
    }

    public Page<WorkResponse> getWorksAssignedByMe(Pageable pageable) {
        Long currentUserId = securityUtils.getCurrentUserId();
        return workRepository.findWorksAssignedByMe(currentUserId, pageable)
                .map(this::toResponse);
    }

    private WorkResponse toResponse(Work work) {
        return WorkResponse.builder()
                .id(work.getId())
                .name(work.getName())
                .dueAt(work.getDueAt())
                .assignedAt(work.getAssignedAt())
                .assignerName(work.getAssignedBy() != null ? work.getAssignedBy().getFullName() : null)
                .status(work.getStatus())
                .description(work.getDescription())
                .build();
    }
}