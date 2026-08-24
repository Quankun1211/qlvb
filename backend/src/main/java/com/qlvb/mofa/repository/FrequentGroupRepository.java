package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.FrequentGroup;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FrequentGroupRepository
        extends JpaRepository<FrequentGroup, Long>,
                JpaSpecificationExecutor<FrequentGroup> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(
            String name,
            Long id
    );

    Page<FrequentGroup> findAllByStatus(
        Byte status,
        Pageable pageable
    );
}