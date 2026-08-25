package com.qlvb.mofa.controller;

import com.qlvb.mofa.dto.response.UnitTreeResponse;
import com.qlvb.mofa.service.UnitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
public class UnitController {

    private final UnitService unitService;

    @GetMapping("/tree")
    public ResponseEntity<List<UnitTreeResponse>> getUnitTree() {
        List<UnitTreeResponse> tree = unitService.getUnitTree();
        return ResponseEntity.ok(tree);
    }
}