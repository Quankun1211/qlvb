package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.IncomingAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncomingAssignmentRepository
        extends JpaRepository<IncomingAssignment, Long> {

    List<IncomingAssignment> findAllByIncomingDocumentIdOrderByAssignedAtDesc(
            Long incomingDocumentId
    );
}