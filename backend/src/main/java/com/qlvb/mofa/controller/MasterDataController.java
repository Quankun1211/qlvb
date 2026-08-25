package com.qlvb.mofa.controller;

import com.qlvb.mofa.repository.DepartmentRepository;
import com.qlvb.mofa.repository.DocumentTypeRepository;
import com.qlvb.mofa.repository.UnitRepository;
import com.qlvb.mofa.repository.UserRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/master-data")
@RequiredArgsConstructor
public class MasterDataController {

    private final UnitRepository unitRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final DocumentTypeRepository documentTypeRepository;

    @GetMapping("/units")
    public ResponseEntity<List<SimpleResponse>> getUnits(
            @RequestParam(required = false) String type
    ) {
        return ResponseEntity.ok(
                unitRepository.findAll().stream()
                        .filter(u -> type == null || (
                                type.equals("INTERNAL") ? (u.getUnitType() != null && (u.getUnitType().equals("UNIT") || u.getUnitType().equals("MINISTRY"))) :
                                type.equals("EXTERNAL") ? (u.getUnitType() != null && u.getUnitType().equals("EXTERNAL")) : true
                        ))
                        .map(u -> SimpleResponse.builder()
                                .id(u.getId())
                                .name(u.getName())
                                .build())
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/departments")
    public ResponseEntity<List<SimpleResponse>> getDepartments() {
        return ResponseEntity.ok(
                departmentRepository.findAll().stream()
                        .map(d -> SimpleResponse.builder()
                                .id(d.getId())
                                .name(d.getName())
                                .build())
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSimpleResponse>> getUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream()
                        .map(u -> UserSimpleResponse.builder()
                                .id(u.getId())
                                .name(u.getFullName())
                                .account(u.getUsername())
                                .build())
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/document-types")
    public ResponseEntity<List<SimpleResponse>> getDocumentTypes() {
        return ResponseEntity.ok(
                documentTypeRepository.findByStatusOrderByNameAsc((byte) 1).stream()
                        .map(type -> SimpleResponse.builder()
                                .id(type.getId())
                                .name(type.getName())
                                .build())
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/units/{unitId}/departments-with-users")
    public ResponseEntity<UnitDepartmentsResponse> getDepartmentsWithUsers(
            @org.springframework.web.bind.annotation.PathVariable Long unitId
    ) {
        var unit = unitRepository.findById(unitId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị"));

        var departments = departmentRepository.findByUnitIdAndStatusOrderByNameAsc(unitId, (byte) 1)
                .stream()
                .map(department -> DepartmentWithUsersResponse.builder()
                        .id(department.getId())
                        .name(department.getName())
                        .users(userRepository.findByDepartmentIdAndStatusOrderByFullNameAsc(department.getId(), (byte) 1)
                                .stream()
                                .map(user -> UserSimpleResponse.builder()
                                        .id(user.getId())
                                        .name(user.getFullName())
                                        .account(user.getUsername())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(UnitDepartmentsResponse.builder()
                .id(unit.getId())
                .name(unit.getName())
                .departments(departments)
                .build());
    }

    @Getter
    @Builder
    public static class SimpleResponse {
        private Long id;
        private String name;
    }

    @Getter
    @Builder
    public static class UserSimpleResponse {
        private Long id;
        private String name;
        private String account;
    }

    @Getter
    @Builder
    public static class DepartmentWithUsersResponse {
        private Long id;
        private String name;
        private List<UserSimpleResponse> users;
    }

    @Getter
    @Builder
    public static class UnitDepartmentsResponse {
        private Long id;
        private String name;
        private List<DepartmentWithUsersResponse> departments;
    }
}
