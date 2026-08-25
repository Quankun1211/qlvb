package com.qlvb.mofa.repository;

import com.qlvb.mofa.dto.enums.OutgoingStatus;
import com.qlvb.mofa.entity.OutgoingDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OutgoingDocumentRepository extends JpaRepository<OutgoingDocument, Long>, JpaSpecificationExecutor<OutgoingDocument> {
    @Query("SELECT od FROM OutgoingDocument od WHERE od.status = :status")
    Page<OutgoingDocument> findByStatus(@Param("status") OutgoingStatus status, Pageable pageable);
    @Query("SELECT od FROM OutgoingDocument od WHERE od.status = :status AND od.draftedBy.id = :userId")
    Page<OutgoingDocument> findByStatusAndDraftedBy(@Param("status") OutgoingStatus status, @Param("userId") Long userId, Pageable pageable);
}