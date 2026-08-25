package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.DraftHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DraftHistoryRepository extends JpaRepository<DraftHistory, Long> {
    List<DraftHistory> findByDraftDocumentIdOrderByCreatedAtAsc(Long draftDocumentId);
}