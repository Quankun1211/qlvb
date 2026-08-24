package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.IncomingProcessingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncomingProcessingHistoryRepository
        extends JpaRepository<IncomingProcessingHistory, Long> {

    List<IncomingProcessingHistory> findAllByIncomingDocumentIdOrderByCreatedAtDesc(
            Long incomingDocumentId
    );
}