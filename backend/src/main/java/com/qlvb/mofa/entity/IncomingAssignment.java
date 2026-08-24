package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.qlvb.mofa.dto.enums.AssignmentStatus;
import com.qlvb.mofa.dto.enums.NotificationType;
import com.qlvb.mofa.dto.enums.WorkType;

@Entity
@Table(
    name = "incoming_assignments",
    indexes = {
        @Index(name = "idx_incoming_assignments_document", columnList = "incoming_document_id"),
        @Index(name = "idx_incoming_assignments_status", columnList = "status"),
        @Index(name = "idx_incoming_assignments_due_at", columnList = "due_at"),
        @Index(name = "idx_incoming_assignments_lead_user", columnList = "lead_user_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "incoming_document_id", nullable = false)
    private IncomingDocument incomingDocument;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_by", nullable = false)
    private User assignedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_user_id")
    private User leadUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_unit_id")
    private Unit leadUnit;

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
    private AssignmentStatus status = AssignmentStatus.UNPROCESSED;

    @Column(name = "return_reason", columnDefinition = "TEXT")
    private String returnReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "assignment")
    @Builder.Default
    private List<IncomingCollaborator> collaborators = new ArrayList<>();

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