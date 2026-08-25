package com.qlvb.mofa.specification;

import com.qlvb.mofa.dto.enums.SubmissionStatus;
import com.qlvb.mofa.entity.Submission;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;

public final class SubmissionSpecification {

    private SubmissionSpecification() {
    }

    public static Specification<Submission> statuses(List<SubmissionStatus> statuses) {
        return (root, query, cb) -> {
                if (statuses == null || statuses.isEmpty()) {
                return null;
                }
                return root.get("status").in(statuses);
        };
        }

    public static Specification<Submission> keyword(
            String keyword
    ) {
        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return null;
            }

            String value =
                    "%" + keyword.trim().toLowerCase() + "%";

            Join<Object, Object> draftedBy =
                    root.join("draftedBy", JoinType.LEFT);

            return cb.or(
                    cb.like(
                            cb.lower(
                                    root.get("submissionNumber")
                            ),
                            value
                    ),

                    cb.like(
                            cb.lower(
                                    root.get("subject")
                            ),
                            value
                    ),

                    cb.like(
                            cb.lower(
                                    draftedBy.get("fullName")
                            ),
                            value
                    )
            );
        };
    }

    public static Specification<Submission> status(
            SubmissionStatus status
    ) {
        return (root, query, cb) -> {

            if (status == null) {
                return null;
            }

            return cb.equal(
                    root.get("status"),
                    status
            );
        };
    }

    public static Specification<Submission> departmentId(
            Long departmentId
    ) {
        return (root, query, cb) -> {

            if (departmentId == null) {
                return null;
            }

            return cb.equal(
                    root.get("department").get("id"),
                    departmentId
            );
        };
    }

    public static Specification<Submission> draftedById(
            Long draftedById
    ) {
        return (root, query, cb) -> {

            if (draftedById == null) {
                return null;
            }

            return cb.equal(
                    root.get("draftedBy").get("id"),
                    draftedById
            );
        };
    }

    public static Specification<Submission> fromDate(
            LocalDate fromDate
    ) {
        return (root, query, cb) -> {

            if (fromDate == null) {
                return null;
            }

            return cb.greaterThanOrEqualTo(
                    root.get("submittedAt"),
                    fromDate
            );
        };
    }

    public static Specification<Submission> toDate(
            LocalDate toDate
    ) {
        return (root, query, cb) -> {

            if (toDate == null) {
                return null;
            }

            return cb.lessThanOrEqualTo(
                    root.get("submittedAt"),
                    toDate
            );
        };
    }
}