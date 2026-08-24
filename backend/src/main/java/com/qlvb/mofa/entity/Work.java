package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.qlvb.mofa.dto.enums.NotificationType;
import com.qlvb.mofa.dto.enums.WorkStatus;
import com.qlvb.mofa.dto.enums.WorkType;

@Entity
@Table(
    name = "works",
    indexes = {
        @Index(name = "idx_works_status", columnList = "status"),
        @Index(name = "idx_works_due_at", columnList = "due_at"),
        @Index(name = "idx_works_record", columnList = "work_record_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incoming_document_id")
    private IncomingDocument incomingDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_record_id")
    private WorkRecord workRecord;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_by", nullable = false)
    private User assignedBy;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(name = "due_at")
    private LocalDateTime dueAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_type", length = 40)
    private WorkType workType;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", length = 40)
    private NotificationType notificationType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private WorkStatus status = WorkStatus.UNPROCESSED;

    @Column(columnDefinition = "TEXT")
    private String description;

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