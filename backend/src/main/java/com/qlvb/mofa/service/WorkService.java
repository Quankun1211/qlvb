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
    private final WorkAssigneeRepository workAssigneeRepository;

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
        String incomingNumber = null;
        String documentNumber = null;
        if (work.getIncomingDocument() != null) {
            incomingNumber = work.getIncomingDocument().getIncomingNumber();
            if (work.getIncomingDocument().getDocument() != null) {
                documentNumber = work.getIncomingDocument().getDocument().getReferenceNumber();
            }
        }

        // Just returning empty lists for now, logic to fetch assignees can be added later
        // if WorkAssignee doesn't store role
        java.util.List<String> assignees = new java.util.ArrayList<>();
        java.util.List<String> collaborators = new java.util.ArrayList<>();

        return WorkResponse.builder()
                .id(work.getId())
                .name(work.getName())
                .incomingNumber(incomingNumber)
                .documentNumber(documentNumber)
                .dueAt(work.getDueAt())
                .assignedAt(work.getAssignedAt())
                .assignerName(work.getAssignedBy() != null ? work.getAssignedBy().getFullName() : null)
                .assigneeNames(assignees)
                .collaboratorNames(collaborators)
                .status(work.getStatus())
                .description(work.getDescription())
                .build();
    }
}