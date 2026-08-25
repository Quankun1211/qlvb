package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.SubmissionComment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionCommentRepository
        extends JpaRepository<SubmissionComment, Long> {

    List<SubmissionComment> findBySubmissionIdOrderBySentAtDesc(
            Long submissionId
    );
}