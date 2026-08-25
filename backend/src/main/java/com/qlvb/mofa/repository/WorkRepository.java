package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.Work;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkRepository extends JpaRepository<Work, Long>, JpaSpecificationExecutor<Work> {

    List<Work> findByIncomingDocumentDocumentId(
            Long documentId
    );

    @Query("SELECT w FROM Work w JOIN WorkAssignee wa ON wa.work.id = w.id WHERE wa.user.id = :userId")
    Page<Work> findWorksAssignedToUser(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT w FROM Work w WHERE w.assignedBy.id = :userId")
    Page<Work> findWorksAssignedByMe(@Param("userId") Long userId, Pageable pageable);
}