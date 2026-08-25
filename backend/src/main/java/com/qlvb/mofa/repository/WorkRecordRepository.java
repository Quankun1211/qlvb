package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.WorkRecord;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WorkRecordRepository
        extends JpaRepository<WorkRecord, Long> {
        @Query("SELECT wr FROM WorkRecord wr WHERE wr.createdBy.id = :userId")
    Page<WorkRecord> findWorkRecordsCreatedByUser(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT wr FROM WorkRecord wr JOIN wr.members m WHERE m.user.id = :userId")
    Page<WorkRecord> findWorkRecordsParticipatedByUser(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT wr FROM WorkRecord wr JOIN wr.members m WHERE m.user.id = :userId AND m.role = 'FOLLOWER'")
    Page<WorkRecord> findWorkRecordsFollowedByUser(@Param("userId") Long userId, Pageable pageable);
}