package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.qlvb.mofa.dto.enums.SubmissionStatus;

@Entity
@Table(
    name = "submissions",
    indexes = {
        @Index(name = "idx_submissions_status", columnList = "status"),
        @Index(name = "idx_submissions_date", columnList = "submitted_at"),
        @Index(name = "idx_submissions_drafted_by", columnList = "drafted_by")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @Column(name = "submission_number", nullable = false, length = 100)
    private String submissionNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subject;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "drafted_by", nullable = false)
    private User draftedBy;

    @Column(name = "submitted_at", nullable = false)
    private LocalDate submittedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(length = 255)
    private String target;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 60)
    private SubmissionStatus status = SubmissionStatus.DRAFTING;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}