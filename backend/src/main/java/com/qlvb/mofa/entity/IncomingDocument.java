package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.qlvb.mofa.dto.enums.IncomingStatus;

@Entity
@Table(
    name = "incoming_documents",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_incoming_document",
            columnNames = "document_id"
        )
    },
    indexes = {
        @Index(name = "idx_incoming_number", columnList = "incoming_number"),
        @Index(name = "idx_incoming_status", columnList = "status"),
        @Index(name = "idx_incoming_received_date", columnList = "received_date"),
        @Index(name = "idx_incoming_unit", columnList = "receiving_unit_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "incoming_number", nullable = false, length = 50)
    private String incomingNumber;

    @Column(name = "received_date", nullable = false)
    private LocalDate receivedDate;

    @Column(name = "receipt_type", length = 50)
    private String receiptType;

    @Column(name = "response_required", columnDefinition = "TINYINT(1)")
    private Boolean responseRequired;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private IncomingStatus status = IncomingStatus.UNPROCESSED;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receiving_unit_id", nullable = false)
    private Unit receivingUnit;

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