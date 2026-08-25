package com.qlvb.mofa.controller;

import com.qlvb.mofa.dto.request.WorkRecordCreateRequest;
import com.qlvb.mofa.dto.response.WorkRecordResponse;
import com.qlvb.mofa.service.WorkRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/work-records")
@RequiredArgsConstructor
public class WorkRecordController {

    private final WorkRecordService workRecordService;

    @GetMapping("/created-by-me")
    public ResponseEntity<Page<WorkRecordResponse>> getCreatedWorkRecords(
            @PageableDefault(size = 20, sort = "assignedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<WorkRecordResponse> result = workRecordService.getCreatedWorkRecords(pageable);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<Long> createWorkRecord(
            @RequestBody WorkRecordCreateRequest request
    ) {
        Long recordId = workRecordService.createWorkRecord(request);
        return ResponseEntity.ok(recordId);
    }
}