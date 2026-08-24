package com.qlvb.mofa.repository;

import com.qlvb.mofa.dto.enums.AssignmentStatus;
import com.qlvb.mofa.dto.enums.IncomingAssignmentType;
import com.qlvb.mofa.dto.enums.IncomingStatus;
import com.qlvb.mofa.dto.enums.NotificationType;
import com.qlvb.mofa.dto.enums.WorkType;
import com.qlvb.mofa.entity.IncomingDocument;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IncomingDocumentRepository
        extends JpaRepository<IncomingDocument, Long> {

    @Query("""
        SELECT i
        FROM IncomingDocument i
        WHERE i.receivingUnit.id = :unitId
        AND (:status IS NULL OR i.status = :status)
    """)
    Page<IncomingDocument> findAllByUnitId(
            @Param("unitId") Long unitId,
            @Param("status") IncomingStatus status,
            Pageable pageable
    );

    @Query("""
        SELECT d
        FROM IncomingDocument d
        WHERE d.id = :id
        AND d.receivingUnit.id = :unitId
    """)
    Optional<IncomingDocument> findDetailByIdAndUnitId(
            @Param("id") Long id,
            @Param("unitId") Long unitId
    );

    @Query("""
        SELECT DISTINCT i
        FROM IncomingDocument i
        JOIN IncomingAssignment a
            ON a.incomingDocument.id = i.id
        WHERE a.leadUser.id = :userId
        AND (:status IS NULL OR i.status = :status)
    """)
    Page<IncomingDocument> findAllByLeadUserId(
            @Param("userId") Long userId,
            @Param("status") IncomingStatus status,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT i
        FROM IncomingDocument i
        JOIN IncomingAssignment a
            ON a.incomingDocument.id = i.id
        WHERE a.leadUser.id = :userId

        AND (
            :status IS NULL
            OR i.status = :status
        )

        AND (
            :workType IS NULL
            OR a.workType = :workType
        )

        AND (
            :notificationType IS NULL
            OR a.notificationType = :notificationType
        )

        AND (
            :assignmentStatus IS NULL
            OR a.status = :assignmentStatus
        )
    """)
    Page<IncomingDocument> findAllForUser(
            @Param("userId") Long userId,
            @Param("status") IncomingStatus status,
            @Param("workType") WorkType workType,
            @Param("notificationType") NotificationType notificationType,
            @Param("assignmentStatus") AssignmentStatus assignmentStatus,
            Pageable pageable
    );

    @Query("""
        SELECT i
        FROM IncomingDocument i
        WHERE i.id = :id
        AND i.receivingUnit.id = :unitId
    """)
    IncomingDocument findDetailByUnitId(
            @Param("id") Long id,
            @Param("unitId") Long unitId
    );

    @Query("""
        SELECT DISTINCT i
        FROM IncomingDocument i
        JOIN i.document d
        WHERE i.receivingUnit.id = :unitId
        AND i.receiptType = 'INTERNAL'
        AND (:status IS NULL OR i.status = :status)
        """)
    Page<IncomingDocument> findAllInternalForUnit(
            @Param("unitId") Long unitId,
            @Param("status") IncomingStatus status,
            Pageable pageable
    );

    @Query("""
        SELECT i
        FROM IncomingDocument i
        JOIN FETCH i.document d
        LEFT JOIN FETCH d.issuingUnit iu
        LEFT JOIN FETCH i.receivingUnit ru
        WHERE ru.id = :unitId
        AND iu.id = :unitId
        AND (:status IS NULL OR i.status = :status)
    """)
    Page<IncomingDocument> findAllInternal(
            @Param("unitId") Long unitId,
            @Param("status") IncomingStatus status,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT i
        FROM IncomingDocument i
        JOIN FETCH i.document d
        LEFT JOIN FETCH d.issuingUnit iu
        LEFT JOIN FETCH i.receivingUnit ru
        WHERE i.id = :id
        AND ru.id = :unitId
        AND iu.id = :unitId
    """)
    Optional<IncomingDocument> findInternalDetail(
            @Param("id") Long id,
            @Param("unitId") Long unitId
    );
}