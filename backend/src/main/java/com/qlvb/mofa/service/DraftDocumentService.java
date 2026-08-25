package com.qlvb.mofa.service;

import com.qlvb.mofa.dto.enums.DraftStatus;
import com.qlvb.mofa.dto.request.DraftDocumentCreateRequest;
import com.qlvb.mofa.dto.request.DraftSearchRequest;
import com.qlvb.mofa.dto.response.DraftDocumentResponse;
import com.qlvb.mofa.entity.DraftDocument;
import com.qlvb.mofa.entity.DraftHistory;
import com.qlvb.mofa.entity.DraftRecipient;
import com.qlvb.mofa.entity.FileEntity;
import com.qlvb.mofa.entity.User;
import com.qlvb.mofa.repository.DraftDocumentRepository;
import com.qlvb.mofa.repository.DraftHistoryRepository;
import com.qlvb.mofa.repository.DraftRecipientRepository;
import com.qlvb.mofa.repository.DocumentTypeRepository;
import com.qlvb.mofa.repository.FileRepository;
import com.qlvb.mofa.repository.UserRepository;
import com.qlvb.mofa.sercurity.SecurityUtils;
import com.qlvb.mofa.service.minio.MinioService;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class DraftDocumentService {

    private final DraftDocumentRepository draftDocumentRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final DraftRecipientRepository draftRecipientRepository;
    private final DraftHistoryRepository draftHistoryRepository;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final MinioService minioService;

    @Transactional
    public DraftDocumentResponse createDraft(
            DraftDocumentCreateRequest request,
            String actionType,
            List<MultipartFile> files
    ) {
        User currentUser = userRepository.findById(securityUtils.getCurrentUserId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng hiện tại"));

        DraftStatus status = switch (actionType) {
            case "REQUEST_OPINION" -> DraftStatus.REQUESTING_OPINION;
            case "SUBMIT" -> DraftStatus.SUBMITTING_UNIT_LEADER;
            default -> DraftStatus.DRAFTING;
        };

        var documentType = documentTypeRepository.findByIdAndStatus(request.getDocumentTypeId(), (byte) 1)
                .orElseThrow(() -> new IllegalArgumentException("Loại văn bản không tồn tại hoặc đã ngừng sử dụng"));

        DraftDocument draft = draftDocumentRepository.save(DraftDocument.builder()
                .documentType(documentType)
                .draftedBy(currentUser)
                .submittedAt(LocalDate.now())
                .subject(request.getSubject().trim())
                .status(status)
                .build());

        if (request.getRecipients() != null) {
            for (DraftDocumentCreateRequest.RecipientRequest recipient : request.getRecipients()) {
                if (!"PD_TT".equals(recipient.getRecipientType()) && !"NK".equals(recipient.getRecipientType())) {
                    throw new IllegalArgumentException("Loại người nhận không hợp lệ");
                }
                User recipientUser = userRepository.findById(recipient.getUserId())
                        .filter(user -> Byte.valueOf((byte) 1).equals(user.getStatus()))
                        .orElseThrow(() -> new IllegalArgumentException("Cán bộ nhận văn bản không tồn tại hoặc đã ngừng hoạt động"));
                draftRecipientRepository.save(DraftRecipient.builder()
                        .draftDocument(draft)
                        .user(recipientUser)
                        .recipientType(recipient.getRecipientType())
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        }

        if (files != null) {
            for (MultipartFile file : files) {
                if (file == null || file.isEmpty()) {
                    continue;
                }
                String storagePath = minioService.uploadFile(file);
                fileRepository.save(FileEntity.builder()
                        .fileName(file.getOriginalFilename())
                        .storagePath(storagePath)
                        .mimeType(file.getContentType())
                        .fileSize(file.getSize())
                        .uploadedBy(currentUser)
                        .entityType("DRAFT_DOCUMENT")
                        .entityId(draft.getId())
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        }

        draftHistoryRepository.save(DraftHistory.builder()
                .draftDocument(draft)
                .performedBy(currentUser)
                .newStatus(status.name())
                .action(actionType)
                .content("Khởi tạo dự thảo")
                .createdAt(LocalDateTime.now())
                .build());

        return toResponse(draft);
    }

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
                .documentTypeId(draft.getDocumentType() != null ? draft.getDocumentType().getId() : null)
                .documentTypeName(draft.getDocumentType() != null ? draft.getDocumentType().getName() : null)
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
