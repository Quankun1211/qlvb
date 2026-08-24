package com.qlvb.mofa.controller;

import com.qlvb.mofa.dto.request.CreateFrequentGroupRequest;
import com.qlvb.mofa.dto.request.FrequentGroupSearchRequest;
import com.qlvb.mofa.dto.response.FrequentGroupResponse;
import com.qlvb.mofa.service.FrequentGroupService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/frequent-groups")
@RequiredArgsConstructor
public class FrequentGroupController {

    private final FrequentGroupService frequentGroupService;

    @PostMapping
    public ResponseEntity<FrequentGroupResponse> create(
            Authentication authentication,
            @Valid @RequestBody CreateFrequentGroupRequest request
    ) {

        String username =
                authentication.getName();

        FrequentGroupResponse response =
                frequentGroupService.create(
                        username,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // @GetMapping
    // public ResponseEntity<Page<FrequentGroupResponse>> getAll(
    //         @PageableDefault(size = 20)
    //         Pageable pageable
    // ) {

    //     return ResponseEntity.ok(
    //             frequentGroupService.getAll(
    //                     pageable
    //             )
    //     );
    // }
    @GetMapping
    public ResponseEntity<Page<FrequentGroupResponse>> getAll(
            @ModelAttribute FrequentGroupSearchRequest request,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                frequentGroupService.getAll(
                        request,
                        pageable
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FrequentGroupResponse> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                frequentGroupService.getById(id)
        );
    }
}