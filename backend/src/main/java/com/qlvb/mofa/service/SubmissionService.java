package com.qlvb.mofa.service;

import com.qlvb.mofa.dto.enums.SubmissionStatus;
import com.qlvb.mofa.dto.request.SubmissionCreateRequest;
import com.qlvb.mofa.dto.request.SubmissionSearchRequest;
import com.qlvb.mofa.dto.response.SubmissionDetailResponse;
import com.qlvb.mofa.dto.response.SubmissionResponse;
import com.qlvb.mofa.entity.Submission;
import com.qlvb.mofa.entity.SubmissionHistory;
import com.qlvb.mofa.repository.DepartmentRepository;
import com.qlvb.mofa.repository.DocumentRepository;
import com.qlvb.mofa.repository.FileRepository;
import com.qlvb.mofa.repository.SubmissionHistoryRepository;
import com.qlvb.mofa.repository.SubmissionRepository;
import com.qlvb.mofa.repository.UserRepository;
import com.qlvb.mofa.specification.SubmissionSpecification;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.qlvb.mofa.specification.SubmissionSpecification.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final FileRepository fileRepository;
    private final SubmissionHistoryRepository submissionHistoryRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public Page<SubmissionResponse> getAll(
            SubmissionSearchRequest request,
            Pageable pageable
    ) {

        Specification<Submission> specification =
                Specification.allOf(
                        keyword(request.getKeyword()),
                        status(request.getStatus()),
                        departmentId(
                                request.getDepartmentId()
                        ),
                        draftedById(
                                request.getDraftedById()
                        ),
                        fromDate(
                                request.getFromDate()
                        ),
                        toDate(
                                request.getToDate()
                        )
                );

        return submissionRepository
                .findAll(
                        specification,
                        pageable
                )
                .map(this::toResponse);
    }

    public SubmissionDetailResponse getDetail(Long id) {
        Submission submission = submissionRepository.findDetailById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy văn bản trình với ID: " + id));

        var attachments = fileRepository.findByEntityTypeAndEntityId("SUBMISSION", id)
                .stream()
                .map(file -> SubmissionDetailResponse.AttachmentResponse.builder()
                        .id(file.getId())
                        .fileName(file.getFileName())
                        .fileUrl(file.getStoragePath())
                        .build())
                .collect(Collectors.toList());

        if (attachments.isEmpty() && submission.getDocument() != null) {
            attachments = fileRepository.findByEntityTypeAndEntityId("DOCUMENT", submission.getDocument().getId())
                    .stream()
                    .map(file -> SubmissionDetailResponse.AttachmentResponse.builder()
                            .id(file.getId())
                            .fileName(file.getFileName())
                            .fileUrl(file.getStoragePath())
                            .build())
                    .collect(Collectors.toList());
        }

        var processes = submissionHistoryRepository.findBySubmissionIdOrderByCreatedAtAsc(id)
                .stream()
                .map(history -> SubmissionDetailResponse.SubmissionProcessResponse.builder()
                        .time(history.getCreatedAt())
                        .content(history.getAction() + ": " + (history.getContent() != null ? history.getContent() : ""))
                        .actorName(history.getPerformedBy() != null ? history.getPerformedBy().getFullName() : null)
                        .unitName(null)
                        .build())
                .collect(Collectors.toList());

        return toDetailResponse(submission, attachments, processes);
    }

    private SubmissionDetailResponse toDetailResponse(
            Submission submission,
            List<SubmissionDetailResponse.AttachmentResponse> attachments,
            List<SubmissionDetailResponse.SubmissionProcessResponse> processes
    ) {
        SubmissionDetailResponse.DocumentInfoResponse documentInfo = null;

        if (submission.getDocument() != null) {
            var doc = submission.getDocument();
            documentInfo = SubmissionDetailResponse.DocumentInfoResponse.builder()
                    .id(doc.getId())
                    .officialSymbol(doc.getReferenceNumber())
                    .incomingNumber(doc.getIncomingNumber())
                    .docTypeName(doc.getDocumentType())
                    .issuedDate(doc.getIssueDate())
                    .arrivalDate(doc.getReceivedDate() != null ? doc.getReceivedDate().atStartOfDay() : null)
                    .issuingAgencyName(doc.getIssuingUnit() != null ? doc.getIssuingUnit().getName() : null)
                    .receivingAgencyName(doc.getReceivingUnit() != null ? doc.getReceivingUnit().getName() : null)
                    .summary(doc.getSubject())
                    .urgencyLevel(null)
                    .securityLevel(null)
                    .build();
        }

        return SubmissionDetailResponse.builder()
                .id(submission.getId())
                .submissionNumber(submission.getSubmissionNumber())
                .subject(submission.getSubject())
                .draftedById(submission.getDraftedBy() != null ? submission.getDraftedBy().getId() : null)
                .draftedByName(submission.getDraftedBy() != null ? submission.getDraftedBy().getFullName() : null)
                .departmentId(submission.getDepartment() != null ? submission.getDepartment().getId() : null)
                .departmentName(submission.getDepartment() != null ? submission.getDepartment().getName() : null)
                .target(submission.getTarget())
                .status(submission.getStatus() != null ? submission.getStatus().name() : null)
                .submittedAt(submission.getSubmittedAt())
                .publishedAt(submission.getPublishedAt())
                .document(documentInfo)
                .attachments(attachments)
                .processes(processes)
                .build();
    }

    private SubmissionResponse toResponse(
            Submission submission
    ) {

        return SubmissionResponse.builder()

                .id(
                        submission.getId()
                )

                .submissionNumber(
                        submission.getSubmissionNumber()
                )

                .subject(
                        submission.getSubject()
                )

                .draftedById(
                        submission.getDraftedBy() != null
                                ? submission.getDraftedBy().getId()
                                : null
                )

                .draftedByName(
                        submission.getDraftedBy() != null
                                ? submission.getDraftedBy().getFullName()
                                : null
                )

                .submittedAt(
                        submission.getSubmittedAt()
                )

                .departmentId(
                        submission.getDepartment() != null
                                ? submission.getDepartment().getId()
                                : null
                )

                .departmentName(
                        submission.getDepartment() != null
                                ? submission.getDepartment().getName()
                                : null
                )

                .target(
                        submission.getTarget()
                )

                .status(
                        submission.getStatus()
                )

                .publishedAt(
                        submission.getPublishedAt()
                )

                .createdAt(
                        submission.getCreatedAt()
                )

                .updatedAt(
                        submission.getUpdatedAt()
                )

                .build();
    }

    public Page<SubmissionResponse> getDraftingSubmissions(
            SubmissionSearchRequest request,
            Pageable pageable
    ) {
        request.setStatus(SubmissionStatus.DRAFTING);
        return getAll(request, pageable);
    }

    public Page<SubmissionResponse> getRequestingOpinionSubmissions(
            SubmissionSearchRequest request,
            Pageable pageable
    ) {
        request.setStatus(SubmissionStatus.REQUESTING_OPINION);
        return getAll(request, pageable);
    }

    public SubmissionDetailResponse getDraftOrRequestingOpinionDetail(Long id) {
        Submission submission = submissionRepository.findDetailById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy văn bản trình với ID: " + id));

        // Kiểm tra xem trạng thái có đúng thuộc nhóm Đang soạn thảo hoặc Xin ý kiến không (nếu cần validate nghiệp vụ)
        if (submission.getStatus() != SubmissionStatus.DRAFTING 
                && submission.getStatus() != SubmissionStatus.REQUESTING_OPINION) {
            throw new RuntimeException("Văn bản không ở trạng thái soạn thảo hoặc xin ý kiến.");
        }

        var attachments = fileRepository.findByEntityTypeAndEntityId("SUBMISSION", id)
                .stream()
                .map(file -> SubmissionDetailResponse.AttachmentResponse.builder()
                        .id(file.getId())
                        .fileName(file.getFileName())
                        .fileUrl(file.getStoragePath())
                        .build())
                .collect(Collectors.toList());

        var processes = submissionHistoryRepository.findBySubmissionIdOrderByCreatedAtAsc(id)
                .stream()
                .map(history -> SubmissionDetailResponse.SubmissionProcessResponse.builder()
                        .time(history.getCreatedAt())
                        .content(history.getAction() + ": " + (history.getContent() != null ? history.getContent() : ""))
                        .actorName(history.getPerformedBy() != null ? history.getPerformedBy().getFullName() : null)
                        .unitName(null)
                        .build())
                .collect(Collectors.toList());

        return toDetailResponse(submission, attachments, processes);
    }

    @Transactional
    public Submission createSubmission(SubmissionCreateRequest request, String actionType) {
        // 1. Xác định trạng thái ban đầu dựa vào nút người dùng bấm
        SubmissionStatus initialStatus;
        String actionName;

        switch (actionType) {
            case "SAVE_DRAFT":
                initialStatus = SubmissionStatus.DRAFTING;
                actionName = "CREATE_DRAFT";
                break;
            case "SAVE_AND_REQUEST_OPINION":
                initialStatus = SubmissionStatus.REQUESTING_OPINION;
                actionName = "REQUEST_OPINION";
                break;
            case "SAVE_AND_SUBMIT":
                initialStatus = SubmissionStatus.SUBMITTING_MINISTRY_LEADER;
                actionName = "SUBMIT";
                break;
            default:
                initialStatus = SubmissionStatus.DRAFTING;
                actionName = "CREATE";
        }

        // 2. Map dữ liệu vào Entity Submission
        Submission submission = Submission.builder()
                .submissionNumber(request.getSubmissionNumber() != null ? request.getSubmissionNumber() : generateSubmissionNumber())
                .subject(request.getSubject())
                .target(request.getTarget())
                .submittedAt(request.getSubmittedAt() != null ? request.getSubmittedAt() : LocalDate.now())
                .status(initialStatus)
                .draftedBy(userRepository.findById(request.getDraftedById())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy người soạn")))
                .department(departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn vị")))
                .document(request.getDocumentId() != null ? documentRepository.findById(request.getDocumentId()).orElse(null) : null)
                .build();

        Submission savedSubmission = submissionRepository.save(submission);

        if (request.getAttachmentFileIds() != null && !request.getAttachmentFileIds().isEmpty()) {
            for (Long fileId : request.getAttachmentFileIds()) {
                fileRepository.findById(fileId).ifPresent(file -> {
                    file.setEntityType("SUBMISSION");
                    file.setEntityId(savedSubmission.getId());
                    fileRepository.save(file);
                });
            }
        }

        // 4. Ghi lịch sử thao tác (SubmissionHistory)
        SubmissionHistory history = SubmissionHistory.builder()
                .submission(savedSubmission)
                .performedBy(savedSubmission.getDraftedBy())
                .oldStatus(null)
                .newStatus(initialStatus.name())
                .action(actionName)
                .content("Khởi tạo tờ trình và thực hiện thao tác: " + actionName)
                .createdAt(LocalDateTime.now())
                .build();
        submissionHistoryRepository.save(history);

        return savedSubmission;
    }

    private String generateSubmissionNumber() {
        return "TTr-" + System.currentTimeMillis(); // Logic sinh số tờ trình tạm thời
    }

    public Page<SubmissionResponse> getPublishedSubmissions(
            SubmissionSearchRequest request,
            Pageable pageable
    ) {
        request.setStatus(SubmissionStatus.PUBLISHED);
        
        Specification<Submission> spec = Specification.allOf(
                SubmissionSpecification.keyword(request.getKeyword()),
                SubmissionSpecification.status(request.getStatus()),
                SubmissionSpecification.departmentId(request.getDepartmentId()),
                SubmissionSpecification.draftedById(request.getDraftedById()),
                SubmissionSpecification.fromDate(request.getFromDate()),
                SubmissionSpecification.toDate(request.getToDate())
        );

        return submissionRepository.findAll(spec, pageable)
                .map(this::toPublishedResponse);
    }

    private SubmissionResponse toPublishedResponse(Submission submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .submissionNumber(submission.getSubmissionNumber())
                .subject(submission.getSubject())
                .draftedById(submission.getDraftedBy() != null ? submission.getDraftedBy().getId() : null)
                .draftedByName(submission.getDraftedBy() != null ? submission.getDraftedBy().getFullName() : null)
                .departmentId(submission.getDepartment() != null ? submission.getDepartment().getId() : null)
                .departmentName(submission.getDepartment() != null ? submission.getDepartment().getName() : null)
                .target(submission.getTarget())
                .status(submission.getStatus())
                .submittedAt(submission.getSubmittedAt())
                .publishedAt(submission.getPublishedAt())
                .createdAt(submission.getCreatedAt())
                .updatedAt(submission.getUpdatedAt())
                .build();
    }

    public Page<SubmissionResponse> getSuspendedSubmissions(
            SubmissionSearchRequest request,
            Pageable pageable
    ) {
        request.setStatus(SubmissionStatus.SUSPENDED);
        return getAll(request, pageable);
    }

    public Page<SubmissionResponse> getReturnedSubmissions(
            SubmissionSearchRequest request,
            Pageable pageable
    ) {
        List<SubmissionStatus> returnedStatuses = List.of(
                SubmissionStatus.DEPARTMENT_RETURNED,
                SubmissionStatus.UNIT_LEADER_RETURNED,
                SubmissionStatus.UNIT_OFFICE_RETURNED,
                SubmissionStatus.MINISTRY_SECRETARY_RETURNED,
                SubmissionStatus.MINISTRY_LEADER_RETURNED,
                SubmissionStatus.MINISTER_RETURNED,
                SubmissionStatus.MINISTRY_OFFICE_RETURNED
        );
        request.setStatuses(returnedStatuses);

        Specification<Submission> spec = Specification.allOf(
                SubmissionSpecification.keyword(request.getKeyword()),
                SubmissionSpecification.statuses(request.getStatuses()),
                SubmissionSpecification.departmentId(request.getDepartmentId()),
                SubmissionSpecification.draftedById(request.getDraftedById()),
                SubmissionSpecification.fromDate(request.getFromDate()),
                SubmissionSpecification.toDate(request.getFromDate())
        );

        return submissionRepository.findAll(spec, pageable)
                .map(this::toResponse);
    }
}