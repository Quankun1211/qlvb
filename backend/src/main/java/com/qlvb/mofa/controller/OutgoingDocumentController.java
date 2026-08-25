package com.qlvb.mofa.controller;

import com.qlvb.mofa.dto.response.OutgoingDocumentDetailResponse;
import com.qlvb.mofa.dto.response.OutgoingDocumentResponse;
import com.qlvb.mofa.service.OutgoingDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/outgoing-documents")
@RequiredArgsConstructor
public class OutgoingDocumentController {

    private final OutgoingDocumentService outgoingDocumentService;

    @GetMapping
    public ResponseEntity<Page<OutgoingDocumentResponse>> getAllOutgoingDocuments(
            @PageableDefault(size = 20, sort = "issueDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<OutgoingDocumentResponse> result = outgoingDocumentService.getAllOutgoingDocuments(pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/published")
    public ResponseEntity<Page<OutgoingDocumentResponse>> getPublishedOutgoingDocuments(
            @PageableDefault(size = 20, sort = "issueDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<OutgoingDocumentResponse> result = outgoingDocumentService.getPublishedOutgoingDocuments(pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/published/my")
    public ResponseEntity<Page<OutgoingDocumentResponse>> getMyPublishedOutgoingDocuments(
            @PageableDefault(size = 20, sort = "issueDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<OutgoingDocumentResponse> result = outgoingDocumentService.getPublishedOutgoingDocumentsByCurrentUser(pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OutgoingDocumentDetailResponse> getOutgoingDocumentDetail(
            @PathVariable Long id
    ) {
        OutgoingDocumentDetailResponse result = outgoingDocumentService.getOutgoingDocumentDetail(id);
        return ResponseEntity.ok(result);
    }
}