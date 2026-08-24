package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "documents",
    indexes = {
        @Index(name = "idx_documents_type_status", columnList = "document_type,status"),
        @Index(name = "idx_documents_received_date", columnList = "received_date"),
        @Index(name = "idx_documents_issue_date", columnList = "issue_date"),
        @Index(name = "idx_documents_reference_number", columnList = "reference_number")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_type", nullable = false, length = 30)
    private String documentType;

    @Column(name = "incoming_number", length = 50)
    private String incomingNumber;

    @Column(name = "outgoing_number", length = 50)
    private String outgoingNumber;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String subject;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issuing_unit_id")
    private Unit issuingUnit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiving_unit_id")
    private Unit receivingUnit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(nullable = false, length = 100)
    private String status;

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