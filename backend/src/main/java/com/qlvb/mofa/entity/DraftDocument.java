package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.qlvb.mofa.dto.enums.DraftStatus;

@Entity
@Table(
    name = "draft_documents",
    indexes = {
        @Index(name = "idx_drafts_status", columnList = "status"),
        @Index(name = "idx_drafts_date", columnList = "submitted_at"),
        @Index(name = "idx_drafts_drafted_by", columnList = "drafted_by")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DraftDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "drafted_by", nullable = false)
    private User draftedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approving_leader_id")
    private User approvingLeader;

    @Column(name = "submitted_at", nullable = false)
    private LocalDate submittedAt;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private DraftStatus status = DraftStatus.DRAFTING;

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