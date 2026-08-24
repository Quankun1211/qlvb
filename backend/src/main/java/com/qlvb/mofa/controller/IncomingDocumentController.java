package com.qlvb.mofa.controller;

import com.qlvb.mofa.dto.request.IncomingDocumentSearchRequest;
import com.qlvb.mofa.dto.response.IncomingDocumentDetailResponse;
import com.qlvb.mofa.dto.response.IncomingDocumentResponse;
import com.qlvb.mofa.service.IncomingDocumentService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/incoming-documents")
@RequiredArgsConstructor
public class IncomingDocumentController {

    private final IncomingDocumentService incomingDocumentService;

    @GetMapping("/unit")
        public ResponseEntity<Page<IncomingDocumentResponse>> getAllForUnit(
                Authentication authentication,
                @ModelAttribute IncomingDocumentSearchRequest request,
                @PageableDefault(size = 20) Pageable pageable
        ) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                incomingDocumentService.getAllForUnit(
                        username,
                        request,
                        pageable
                )
        );
        }
    @GetMapping("/me")
        public ResponseEntity<Page<IncomingDocumentResponse>> getAllForMe(
                Authentication authentication,
                @ModelAttribute IncomingDocumentSearchRequest request,
                @PageableDefault(size = 20) Pageable pageable
        ) {

        return ResponseEntity.ok(
                incomingDocumentService.getAllForMe(
                        authentication.getName(),
                        request,
                        pageable
                )
        );
        }
    @GetMapping("/unit/{id}")
        public ResponseEntity<IncomingDocumentDetailResponse> getDetailForUnit(
                Authentication authentication,
                @PathVariable Long id
        ) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                incomingDocumentService.getDetailForUnit(
                        username,
                        id
                )
        );
        }
    
    @GetMapping("/{id}")
    public ResponseEntity<IncomingDocumentDetailResponse> getDetail(
            Authentication authentication,
            @PathVariable Long id
    ) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                incomingDocumentService.getDetail(
                        username,
                        id
                )
        );
    }

    @GetMapping("/internal")
        public ResponseEntity<Page<IncomingDocumentResponse>> getAllInternal(
                Authentication authentication,
                @ModelAttribute IncomingDocumentSearchRequest request,
                @PageableDefault(size = 20) Pageable pageable
        ) {
        return ResponseEntity.ok(
                incomingDocumentService.getAllInternal(
                        authentication.getName(),
                        request,
                        pageable
                )
        );
        }
     @GetMapping("/internal/{id}")
        public ResponseEntity<IncomingDocumentDetailResponse> getInternalDetail(
                Authentication authentication,
                @PathVariable Long id
        ) {
        return ResponseEntity.ok(
                incomingDocumentService.getInternalDetail(
                        authentication.getName(),
                        id
                )
        );
        }
}