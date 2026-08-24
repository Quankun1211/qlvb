package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.Department;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    List<Department> findAllByIdInAndStatus(
            List<Long> ids,
            Byte status
    );
}