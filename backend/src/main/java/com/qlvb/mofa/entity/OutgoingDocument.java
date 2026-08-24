package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.qlvb.mofa.dto.enums.OutgoingStatus;

@Entity
@Table(
    name = "outgoing_documents",
    indexes = {
        @Index(name = "idx_outgoing_status", columnList = "status"),
        @Index(name = "idx_outgoing_issue_date", columnList = "issue_date"),
        @Index(name = "idx_outgoing_number", columnList = "outgoing_number")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutgoingDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @Column(name = "outgoing_number", length = 50)
    private String outgoingNumber;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subject;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "drafted_by", nullable = false)
    private User draftedBy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "signed_by", nullable = false)
    private User signedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OutgoingStatus status = OutgoingStatus.DRAFTING;

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