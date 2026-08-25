package com.qlvb.mofa.service;

import com.qlvb.mofa.dto.enums.DraftStatus;
import com.qlvb.mofa.dto.request.DraftSearchRequest;
import com.qlvb.mofa.dto.response.DraftDocumentResponse;
import com.qlvb.mofa.entity.DraftDocument;
import com.qlvb.mofa.repository.DraftDocumentRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DraftDocumentService {

    private final DraftDocumentRepository draftDocumentRepository;

    public Page<DraftDocumentResponse> getAllDrafts(DraftSearchRequest request, Pageable pageable) {
        request.setStatus(null);
        request.setStatuses(null);
        return searchDrafts(request, pageable);
    }

    public Page<DraftDocumentResponse> getDraftingOrOpinionDrafts(DraftSearchRequest request, Pageable pageable) {
        request.setStatuses(List.of(
                DraftStatus.DRAFTING, 
                DraftStatus.REQUESTING_OPINION, 
                DraftStatus.SUBMITTING_UNIT_LEADER
        ));
        return searchDrafts(request, pageable);
    }

    public Page<DraftDocumentResponse> getApprovedDrafts(DraftSearchRequest request, Pageable pageable) {
        request.setStatuses(List.of(
                DraftStatus.APPROVED, 
                DraftStatus.PUBLISHED
        ));
        return searchDrafts(request, pageable);
    }

    public Page<DraftDocumentResponse> getSuspendedDrafts(DraftSearchRequest request, Pageable pageable) {
        request.setStatus(DraftStatus.SUSPENDED);
        request.setStatuses(null);
        return searchDrafts(request, pageable);
    }

    public Page<DraftDocumentResponse> searchDrafts(DraftSearchRequest request, Pageable pageable) {
        Specification<DraftDocument> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("subject")), "%" + request.getKeyword().toLowerCase() + "%"));
            }
            if (request.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), request.getStatus()));
            }
            if (request.getStatuses() != null && !request.getStatuses().isEmpty()) {
                predicates.add(root.get("status").in(request.getStatuses()));
            }
            if (request.getDraftedById() != null) {
                predicates.add(cb.equal(root.get("draftedBy").get("id"), request.getDraftedById()));
            }
            if (request.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("submittedAt"), request.getFromDate()));
            }
            if (request.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("submittedAt"), request.getToDate()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return draftDocumentRepository.findAll(spec, pageable)
                .map(this::toResponse);
    }

    private DraftDocumentResponse toResponse(DraftDocument draft) {
        return DraftDocumentResponse.builder()
                .id(draft.getId())
                .subject(draft.getSubject())
                .draftedById(draft.getDraftedBy() != null ? draft.getDraftedBy().getId() : null)
                .draftedByName(draft.getDraftedBy() != null ? draft.getDraftedBy().getFullName() : null)
                .approvingLeaderId(draft.getApprovingLeader() != null ? draft.getApprovingLeader().getId() : null)
                .approvingLeaderName(draft.getApprovingLeader() != null ? draft.getApprovingLeader().getFullName() : null)
                .submittedAt(draft.getSubmittedAt())
                .status(draft.getStatus())
                .createdAt(draft.getCreatedAt())
                .build();
    }
}