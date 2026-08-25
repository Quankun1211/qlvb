package com.qlvb.mofa.controller;

import com.qlvb.mofa.dto.request.SubmissionCreateRequest;
import com.qlvb.mofa.dto.request.SubmissionSearchRequest;
import com.qlvb.mofa.dto.response.SubmissionDetailResponse;
import com.qlvb.mofa.dto.response.SubmissionResponse;
import com.qlvb.mofa.entity.Submission;
import com.qlvb.mofa.service.SubmissionService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping
    public ResponseEntity<Page<SubmissionResponse>> getAll(

            @ModelAttribute
            SubmissionSearchRequest request,

            @PageableDefault(
                    size = 20,
                    sort = "submittedAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                submissionService.getAll(
                        request,
                        pageable
                )
        );
    }

    @GetMapping("/drafting")
    public ResponseEntity<Page<SubmissionResponse>> getDraftingSubmissions(
            @ModelAttribute SubmissionSearchRequest request,
            @PageableDefault(size = 20, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(submissionService.getDraftingSubmissions(request, pageable));
    }

    @GetMapping("/requesting-opinion")
    public ResponseEntity<Page<SubmissionResponse>> getRequestingOpinionSubmissions(
            @ModelAttribute SubmissionSearchRequest request,
            @PageableDefault(size = 20, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(submissionService.getRequestingOpinionSubmissions(request, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionDetailResponse> getDetail(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(submissionService.getDetail(id));
    }

    @GetMapping("/drafts-or-opinions/{id}")
    public ResponseEntity<SubmissionDetailResponse> getDraftOrOpinionDetail(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(submissionService.getDraftOrRequestingOpinionDetail(id));
    }

    @PostMapping
    public ResponseEntity<Submission> createSubmission(
            @RequestBody SubmissionCreateRequest request,
            @RequestParam(defaultValue = "SAVE_DRAFT") String actionType 
    ) {
        Submission newSubmission = submissionService.createSubmission(request, actionType);
        return ResponseEntity.ok(newSubmission);
    }

    @GetMapping("/published")
    public ResponseEntity<Page<SubmissionResponse>> getPublishedSubmissions(
            @ModelAttribute SubmissionSearchRequest request,
            @PageableDefault(size = 20, sort = "publishedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(submissionService.getPublishedSubmissions(request, pageable));
    }

    @GetMapping("/suspended")
    public ResponseEntity<Page<SubmissionResponse>> getSuspendedSubmissions(
            @ModelAttribute SubmissionSearchRequest request,
            @PageableDefault(size = 20, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(submissionService.getSuspendedSubmissions(request, pageable));
    }

    @GetMapping("/returned")
    public ResponseEntity<Page<SubmissionResponse>> getReturnedSubmissions(
            @ModelAttribute SubmissionSearchRequest request,
            @PageableDefault(size = 20, sort = "submittedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(submissionService.getReturnedSubmissions(request, pageable));
    }
}