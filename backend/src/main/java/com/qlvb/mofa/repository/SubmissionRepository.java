package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.Submission;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface SubmissionRepository
        extends JpaRepository<Submission, Long>,
                JpaSpecificationExecutor<Submission> {

    @EntityGraph(
            attributePaths = {
                    "document",
                    "document.issuingUnit",
                    "document.receivingUnit",
                    "draftedBy",
                    "department"
            }
    )
    Optional<Submission> findDetailById(Long id);
}