package com.qlvb.mofa.controller;

import com.qlvb.mofa.dto.request.DraftSearchRequest;
import com.qlvb.mofa.dto.request.DraftDocumentCreateRequest;
import com.qlvb.mofa.dto.response.DraftDocumentResponse;
import com.qlvb.mofa.service.DraftDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/draft-documents")
@RequiredArgsConstructor
public class DraftDocumentController {

    private final DraftDocumentService draftDocumentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DraftDocumentResponse> createDraft(
            @Valid @RequestPart("request") DraftDocumentCreateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(defaultValue = "SAVE_DRAFT") String actionType
    ) {
        return ResponseEntity.ok(draftDocumentService.createDraft(request, actionType, files));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<DraftDocumentResponse>> getAllDrafts(
            @ModelAttribute DraftSearchRequest request,
            @PageableDefault(size = 20, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(draftDocumentService.getAllDrafts(request, pageable));
    }

    @GetMapping("/drafting-or-opinion")
    public ResponseEntity<Page<DraftDocumentResponse>> getDraftingOrOpinionDrafts(
            @ModelAttribute DraftSearchRequest request,
            @PageableDefault(size = 20, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(draftDocumentService.getDraftingOrOpinionDrafts(request, pageable));
    }

    @GetMapping("/approved")
    public ResponseEntity<Page<DraftDocumentResponse>> getApprovedDrafts(
            @ModelAttribute DraftSearchRequest request,
            @PageableDefault(size = 20, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(draftDocumentService.getApprovedDrafts(request, pageable));
    }

    @GetMapping("/suspended")
    public ResponseEntity<Page<DraftDocumentResponse>> getSuspendedDrafts(
            @ModelAttribute DraftSearchRequest request,
            @PageableDefault(size = 20, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(draftDocumentService.getSuspendedDrafts(request, pageable));
    }
}
