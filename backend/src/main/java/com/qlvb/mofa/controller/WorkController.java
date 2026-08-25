package com.qlvb.mofa.controller;

import com.qlvb.mofa.dto.response.WorkResponse;
import com.qlvb.mofa.sercurity.SecurityUtils;
import com.qlvb.mofa.service.WorkService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/works")
@RequiredArgsConstructor
public class WorkController {

    private final WorkService workService;
    private final SecurityUtils securityUtils;

    @GetMapping("/assigned-to-me")
    public ResponseEntity<Page<WorkResponse>> getWorksAssignedToMe(
            @PageableDefault(size = 20, sort = "assignedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Long userId = securityUtils.getCurrentUserId(); // Lấy trực tiếp ID người dùng từ SecurityUtils
        Page<WorkResponse> result = workService.getWorksAssignedToUser(userId, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/assigned-by-me")
    public ResponseEntity<Page<WorkResponse>> getWorksAssignedByMe(
            @PageableDefault(size = 20, sort = "assignedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<WorkResponse> result = workService.getWorksAssignedByMe(pageable);
        return ResponseEntity.ok(result);
    }
}