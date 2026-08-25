package com.qlvb.mofa.controller;

import com.qlvb.mofa.dto.request.DraftSearchRequest;
import com.qlvb.mofa.dto.response.DraftDocumentResponse;
import com.qlvb.mofa.service.DraftDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/draft-documents")
@RequiredArgsConstructor
public class DraftDocumentController {

    private final DraftDocumentService draftDocumentService;

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