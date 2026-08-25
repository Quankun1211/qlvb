package com.qlvb.mofa.controller;

import com.qlvb.mofa.dto.request.WorkRecordCreateRequest;
import com.qlvb.mofa.dto.response.WorkRecordResponse;
import com.qlvb.mofa.service.WorkRecordService;
import com.qlvb.mofa.service.minio.MinioService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/work-records")
@RequiredArgsConstructor
public class WorkRecordController {

    private final WorkRecordService workRecordService;
    private final MinioService minioService;

    @GetMapping("/created-by-me")
    public ResponseEntity<Page<WorkRecordResponse>> getCreatedWorkRecords(
            @PageableDefault(size = 20, sort = "assignedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<WorkRecordResponse> result = workRecordService.getCreatedWorkRecords(pageable);
        return ResponseEntity.ok(result);
    }

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> createWorkRecord(
            @ModelAttribute WorkRecordCreateRequest request,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file
    ) {
        Long recordId = workRecordService.createWorkRecord(request, file);
        return ResponseEntity.ok(recordId);
    }
    
    @GetMapping("/participated")
    public ResponseEntity<Page<WorkRecordResponse>> getParticipatedWorkRecords(
            @PageableDefault(size = 20, sort = "assignedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<WorkRecordResponse> result = workRecordService.getParticipatedWorkRecords(pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/followed")
    public ResponseEntity<Page<WorkRecordResponse>> getFollowedWorkRecords(
            @PageableDefault(size = 20, sort = "assignedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<WorkRecordResponse> result = workRecordService.getFollowedWorkRecords(pageable);
        return ResponseEntity.ok(result);
    }
}