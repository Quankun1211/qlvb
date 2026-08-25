package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.SubmissionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionHistoryRepository extends JpaRepository<SubmissionHistory, Long> {
    List<SubmissionHistory> findBySubmissionIdOrderByCreatedAtAsc(Long submissionId);
}