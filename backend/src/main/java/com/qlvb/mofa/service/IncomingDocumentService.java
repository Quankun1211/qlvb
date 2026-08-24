package com.qlvb.mofa.service;

import com.qlvb.mofa.dto.request.IncomingDocumentSearchRequest;
import com.qlvb.mofa.dto.response.IncomingDocumentAttachmentResponse;
import com.qlvb.mofa.dto.response.IncomingDocumentDetailResponse;
import com.qlvb.mofa.dto.response.IncomingDocumentHistoryResponse;
// import com.qlvb.mofa.dto.response.IncomingDocumentDetailResponse;
import com.qlvb.mofa.dto.response.IncomingDocumentResponse;
import com.qlvb.mofa.dto.response.IncomingDocumentWorkResponse;
import com.qlvb.mofa.entity.Document;
import com.qlvb.mofa.entity.IncomingAttachment;
import com.qlvb.mofa.entity.IncomingDocument;
import com.qlvb.mofa.entity.User;
import com.qlvb.mofa.repository.IncomingAssignmentRepository;
import com.qlvb.mofa.repository.IncomingAttachmentRepository;
import com.qlvb.mofa.repository.IncomingDocumentRepository;
import com.qlvb.mofa.repository.IncomingProcessingHistoryRepository;
import com.qlvb.mofa.service.minio.MinioService;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IncomingDocumentService {

    private final IncomingDocumentRepository incomingDocumentRepository;
    private final UserService userService;
    private final IncomingAttachmentRepository incomingAttachmentRepository;
    private final IncomingAssignmentRepository incomingAssignmentRepository;
    private final IncomingProcessingHistoryRepository incomingProcessingHistoryRepository;
    private final MinioService minioService;

    public Page<IncomingDocumentResponse> getAllForUnit(
                String username,
                IncomingDocumentSearchRequest request,
                Pageable pageable
        ) {

        User user = userService.findActiveByUsername(username);

        if (user.getUnit() == null) {
                throw new IllegalStateException(
                        "Người dùng chưa được phân công đơn vị"
                );
        }

        Long unitId = user.getUnit().getId();

        Page<IncomingDocument> page =
                incomingDocumentRepository.findAllByUnitId(
                        unitId,
                        request.getStatus(),
                        pageable
                );

        return page.map(this::toResponse);
        }

   public Page<IncomingDocumentResponse> getAllForMe(
        String username,
        IncomingDocumentSearchRequest request,
        Pageable pageable
        ) {

        User user = userService.findActiveByUsername(username);

        Page<IncomingDocument> page =
                incomingDocumentRepository.findAllForUser(
                        user.getId(),
                        request.getStatus(),
                        request.getWorkType(),
                        request.getNotificationType(),
                        request.getAssignmentStatus(),
                        pageable
                );

        return page.map(this::toResponse);
        }

        @Transactional(readOnly = true)
        public IncomingDocumentDetailResponse getDetailForUnit(
                String username,
                Long incomingDocumentId
        ) {

        User user = userService.findActiveByUsername(username);

        if (user.getUnit() == null) {
                throw new IllegalStateException(
                        "Người dùng chưa được phân công đơn vị"
                );
        }

        Long unitId = user.getUnit().getId();

        IncomingDocument incomingDocument =
                incomingDocumentRepository
                        .findDetailByUnitId(
                                incomingDocumentId,
                                unitId
                        );

        return toDetailResponse(incomingDocument);
        }
    private IncomingDocumentDetailResponse toDetailResponse(
        IncomingDocument entity
        ) {

        Document document = entity.getDocument();

        return IncomingDocumentDetailResponse.builder()

                .id(entity.getId())

                .documentId(
                        document != null
                                ? document.getId()
                                : null
                )

                .incomingNumber(
                        entity.getIncomingNumber()
                )

                .documentNumber(
                        document != null
                                ? document.getReferenceNumber()
                                : null
                )

                .documentType(
                        document != null
                                ? document.getDocumentType()
                                : null
                )

                .issuedDate(
                        document != null
                                ? document.getIssueDate()
                                : null
                )

                .receivedDate(
                        entity.getReceivedDate()
                )

                .receivedAt(
                        entity.getCreatedAt()
                )

                .issuingAgency(
                        document != null &&
                        document.getIssuingUnit() != null
                                ? document.getIssuingUnit().getName()
                                : null
                )

                .summary(
                        document != null
                                ? document.getSubject()
                                : null
                )

                .status(
                        entity.getStatus() != null
                                ? entity.getStatus().name()
                                : null
                )

                .responseRequired(entity.getResponseRequired())

                .createdAt(
                        entity.getCreatedAt()
                )

                .updatedAt(
                        entity.getUpdatedAt()
                )

                .attachments(
                        getAttachments(entity)
                )

                .works(
                        getWorks(entity)
                )

                .histories(
                        getHistories(entity)
                )

                .build();
        }

    private IncomingDocumentResponse toResponse(
            IncomingDocument incomingDocument
    ) {

        Document document = incomingDocument.getDocument();

        return IncomingDocumentResponse.builder()

                .id(incomingDocument.getId())

                .documentId(
                        document != null
                                ? document.getId()
                                : null
                )

                .incomingNumber(
                        incomingDocument.getIncomingNumber()
                )

                .documentNumber(
                        document != null
                                ? document.getReferenceNumber()
                                : null
                )

                .summary(
                        document != null
                                ? document.getSubject()
                                : null
                )

                .receivedDate(
                        incomingDocument.getReceivedDate()
                )

                .issuingAgency(
                        document != null
                                && document.getIssuingUnit() != null
                                ? document.getIssuingUnit().getName()
                                : null
                )

                .handlingUnit(
                        incomingDocument.getReceivingUnit() != null
                                ? incomingDocument.getReceivingUnit().getName()
                                : null
                )

                .documentType(
                        document != null
                                ? document.getDocumentType()
                                : null
                )

                .status(
                        incomingDocument.getStatus() != null
                                ? incomingDocument.getStatus().name()
                                : null
                )

                .responseRequired(
                        incomingDocument.getResponseRequired()
                )

                .createdAt(
                        incomingDocument.getCreatedAt()
                )

                .updatedAt(
                        incomingDocument.getUpdatedAt()
                )

                .build();
    }

    public IncomingDocumentDetailResponse getDetail(
        String username,
        Long id
        ) {
        User user = userService.findActiveByUsername(username);

        if (user.getUnit() == null) {
                throw new IllegalStateException(
                        "Người dùng chưa được phân công đơn vị"
                );
        }

        IncomingDocument incomingDocument =
                incomingDocumentRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Không tìm thấy văn bản đến: " + id
                                )
                        );

        if (!incomingDocument.getReceivingUnit().getId()
                .equals(user.getUnit().getId())) {
                throw new IllegalStateException(
                        "Bạn không có quyền xem văn bản này"
                );
        }

        Document document = incomingDocument.getDocument();

        return IncomingDocumentDetailResponse.builder()
                .id(incomingDocument.getId())
                .documentId(document.getId())
                .incomingNumber(incomingDocument.getIncomingNumber())
                .documentNumber(document.getReferenceNumber())
                .summary(document.getSubject())
                .receivedDate(incomingDocument.getReceivedDate())
                .issuingAgency(
                        document.getIssuingUnit() != null
                                ? document.getIssuingUnit().getName()
                                : null
                )
                .handlingUnit(
                        incomingDocument.getReceivingUnit() != null
                                ? incomingDocument.getReceivingUnit().getName()
                                : null
                )
                .documentType(document.getDocumentType())
                .status(
                        incomingDocument.getStatus() != null
                                ? incomingDocument.getStatus().name()
                                : null
                )
                .responseRequired(incomingDocument.getResponseRequired())
                .createdAt(incomingDocument.getCreatedAt())
                .updatedAt(incomingDocument.getUpdatedAt())
                .attachments(getAttachments(incomingDocument))
                .works(getWorks(incomingDocument))
                .histories(getHistories(incomingDocument))
                .opinions(List.of())
                .build();
        }
     public Page<IncomingDocumentResponse> getAllInternal(
        String username,
        IncomingDocumentSearchRequest request,
        Pageable pageable
        ) {
        User user = userService.findActiveByUsername(username);

        if (user.getUnit() == null) {
                throw new IllegalStateException(
                        "Người dùng chưa được phân công đơn vị"
                );
        }

        Page<IncomingDocument> page =
                incomingDocumentRepository.findAllInternalForUnit(
                        user.getUnit().getId(),
                        request.getStatus(),
                        pageable
                );

        return page.map(this::toResponse);
        }
     @Transactional(readOnly = true)
        public IncomingDocumentDetailResponse getInternalDetail(
                String username,
                Long id
        ) {
        User user = userService.findActiveByUsername(username);

        if (user.getUnit() == null) {
                throw new IllegalStateException(
                        "Người dùng chưa được phân công đơn vị"
                );
        }

        Long unitId = user.getUnit().getId();

        IncomingDocument incomingDocument =
                incomingDocumentRepository
                        .findInternalDetail(id, unitId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Không tìm thấy văn bản đến nội bộ: " + id
                                )
                        );

        return toDetailResponse(incomingDocument);
        }

        private List<IncomingDocumentAttachmentResponse> getAttachments(
                IncomingDocument incomingDocument
        ) {
        return incomingAttachmentRepository
                .findAllByIncomingDocumentIdOrderByCreatedAtDesc(
                        incomingDocument.getId()
                )
                .stream()
                .map(attachment -> IncomingDocumentAttachmentResponse.builder()
                        .id(attachment.getId())
                        .fileName(attachment.getFileName())
                        .objectName(attachment.getObjectName())
                        .fileUrl(minioService.getPresignedUrl(attachment.getObjectName()))
                        .fileType(attachment.getContentType())
                        .fileSize(attachment.getFileSize())
                        .signed(null)
                        .build()
                )
                .toList();
        }

        private List<IncomingDocumentWorkResponse> getWorks(
                IncomingDocument incomingDocument
        ) {
        return incomingAssignmentRepository
                .findAllByIncomingDocumentIdOrderByAssignedAtDesc(
                        incomingDocument.getId()
                )
                .stream()
                .map(assignment -> IncomingDocumentWorkResponse.builder()
                        .id(assignment.getId())
                        .workType(
                                assignment.getWorkType() != null
                                        ? assignment.getWorkType().name()
                                        : null
                        )
                        .notificationType(
                                assignment.getNotificationType() != null
                                        ? assignment.getNotificationType().name()
                                        : null
                        )
                        .status(
                                assignment.getStatus() != null
                                        ? assignment.getStatus().name()
                                        : null
                        )
                        .assignedAt(assignment.getAssignedAt())
                        .dueAt(assignment.getDueAt())
                        .returnReason(assignment.getReturnReason())
                        .assignedById(
                                assignment.getAssignedBy() != null
                                        ? assignment.getAssignedBy().getId()
                                        : null
                        )
                        .leadUserId(
                                assignment.getLeadUser() != null
                                        ? assignment.getLeadUser().getId()
                                        : null
                        )
                        .leadUnitId(
                                assignment.getLeadUnit() != null
                                        ? assignment.getLeadUnit().getId()
                                        : null
                        )
                        .leadUnitName(
                                assignment.getLeadUnit() != null
                                        ? assignment.getLeadUnit().getName()
                                        : null
                        )
                        .build()
                )
                .toList();
        }

        private List<IncomingDocumentHistoryResponse> getHistories(
                IncomingDocument incomingDocument
        ) {
        return incomingProcessingHistoryRepository
                .findAllByIncomingDocumentIdOrderByCreatedAtDesc(
                        incomingDocument.getId()
                )
                .stream()
                .map(history -> IncomingDocumentHistoryResponse.builder()
                        .id(history.getId())
                        .createdAt(history.getCreatedAt())
                        .action(history.getAction())
                        .oldStatus(history.getOldStatus())
                        .newStatus(history.getNewStatus())
                        .content(history.getContent())
                        .processedById(
                                history.getProcessedBy() != null
                                        ? history.getProcessedBy().getId()
                                        : null
                        )
                        .build()
                )
                .toList();
        }
}