package com.qlvb.mofa.service;

import com.qlvb.mofa.dto.enums.OutgoingStatus;
import com.qlvb.mofa.dto.response.OutgoingDocumentDetailResponse;
import com.qlvb.mofa.dto.response.OutgoingDocumentResponse;
import com.qlvb.mofa.entity.OutgoingDocument;
import com.qlvb.mofa.repository.OutgoingDocumentRepository;
import com.qlvb.mofa.repository.OutgoingRecipientRepository;
import com.qlvb.mofa.sercurity.SecurityUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OutgoingDocumentService {

    private final OutgoingDocumentRepository outgoingDocumentRepository;
    private final OutgoingRecipientRepository outgoingRecipientRepository;
    private SecurityUtils securityUtils;
    public Page<OutgoingDocumentResponse> getAllOutgoingDocuments(Pageable pageable) {
        return outgoingDocumentRepository.findAll(pageable)
                .map(this::toResponse);
    }

    private OutgoingDocumentResponse toResponse(OutgoingDocument doc) {
        // Lấy danh sách tên đơn vị/người nhận từ bảng outgoing_recipients
        var recipients = outgoingRecipientRepository.findByOutgoingDocumentId(doc.getId());
        var recipientNames = recipients.stream().map(r -> {
            if (r.getUnit() != null) return r.getUnit().getName();
            if (r.getDepartment() != null) return r.getDepartment().getName();
            if (r.getUser() != null) return r.getUser().getFullName();
            return "";
        }).filter(name -> !name.isEmpty()).collect(Collectors.toList());

        return OutgoingDocumentResponse.builder()
                .id(doc.getId())
                .outgoingNumber(doc.getOutgoingNumber())
                .referenceNumber(doc.getReferenceNumber())
                .issueDate(doc.getIssueDate())
                .subject(doc.getSubject())
                .drafterName(doc.getDraftedBy() != null ? doc.getDraftedBy().getFullName() : null)
                .signerName(doc.getSignedBy() != null ? doc.getSignedBy().getFullName() : null)
                .recipientNames(recipientNames)
                .status(doc.getStatus() != null ? doc.getStatus().name() : null)
                .build();
    }

    public Page<OutgoingDocumentResponse> getPublishedOutgoingDocuments(Pageable pageable) {
        return outgoingDocumentRepository.findByStatus(OutgoingStatus.PUBLISHED, pageable)
                .map(this::toResponse);
    }

    public Page<OutgoingDocumentResponse> getPublishedOutgoingDocumentsByCurrentUser(Pageable pageable) {
        Long currentUserId = securityUtils.getCurrentUserId();
        return outgoingDocumentRepository.findByStatusAndDraftedBy(OutgoingStatus.PUBLISHED, currentUserId, pageable)
                .map(this::toResponse);
    }

    public OutgoingDocumentDetailResponse getOutgoingDocumentDetail(Long id) {
        OutgoingDocument doc = outgoingDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy văn bản đi với ID: " + id));

        // Lấy danh sách nơi nhận
        var recipients = outgoingRecipientRepository.findByOutgoingDocumentId(doc.getId())
                .stream()
                .map(r -> OutgoingDocumentDetailResponse.RecipientDto.builder()
                        .senderName(doc.getDraftedBy() != null ? doc.getDraftedBy().getFullName() : null)
                        .senderDepartment(doc.getDraftedBy() != null && doc.getDraftedBy().getDepartment() != null ? doc.getDraftedBy().getDepartment().getName() : null)
                        .sentAt(r.getSentAt())
                        .recipientName(r.getUnit() != null ? r.getUnit().getName() : (r.getDepartment() != null ? r.getDepartment().getName() : (r.getUser() != null ? r.getUser().getFullName() : null)))
                        .receivedAt(r.getSentAt()) // Có thể điều chỉnh theo logic thực tế
                        .deliveryMethod(r.getRecipientType())
                        .deliveryStatus(r.getDeliveryStatus())
                        .build())
                .collect(Collectors.toList());

        List<OutgoingDocumentDetailResponse.AttachmentDto> attachments = java.util.Collections.emptyList();
        if (doc.getAttachmentName() != null) {
            attachments = List.of(OutgoingDocumentDetailResponse.AttachmentDto.builder()
                    .fileName(doc.getAttachmentName())
                    .filePath(doc.getAttachmentPath())
                    .build());
        }

        return OutgoingDocumentDetailResponse.builder()
                .id(doc.getId())
                .outgoingNumber(doc.getOutgoingNumber())
                .referenceNumber(doc.getReferenceNumber())
                .documentType(doc.getDocument() != null ? doc.getDocument().getDocumentType() : "Công văn")
                .issueDate(doc.getIssueDate())
                .securityLevel("Bình thường")
                .urgencyLevel("Hỏa tốc")
                .subject(doc.getSubject())
                .signerName(doc.getSignedBy() != null ? doc.getSignedBy().getFullName() : null)
                .signerPosition("Phó Cục trưởng")
                .drafterName(doc.getDraftedBy() != null ? doc.getDraftedBy().getFullName() : null)
                .status(doc.getStatus() != null ? doc.getStatus().name() : null)
                .bookName("Sổ công văn / Sổ công điện đi")
                .departmentName(doc.getDraftedBy() != null && doc.getDraftedBy().getDepartment() != null ? doc.getDraftedBy().getDepartment().getName() : null)
                .pageCount(0)
                .sourceDocumentTitle(doc.getDraftDocument() != null ? doc.getDraftDocument().getSubject() : null)
                .attachments(attachments)
                .recipients(recipients)
                .build();
    }
}