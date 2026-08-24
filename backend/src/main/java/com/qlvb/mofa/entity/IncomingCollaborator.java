package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "incoming_collaborators",
    indexes = {
        @Index(name = "idx_incoming_collab_assignment", columnList = "assignment_id"),
        @Index(name = "idx_incoming_collab_user", columnList = "user_id"),
        @Index(name = "idx_incoming_collab_unit", columnList = "unit_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomingCollaborator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assignment_id", nullable = false)
    private IncomingAssignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(length = 50)
    private String status;
}