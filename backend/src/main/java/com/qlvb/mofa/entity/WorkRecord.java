package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.qlvb.mofa.dto.enums.WorkRecordStatus;

@Entity
@Table(
    name = "work_records",
    indexes = {
        @Index(name = "idx_work_records_status", columnList = "status")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String recordNumber;

    @Column(nullable = false, length = 500)
    private String name;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Column(name = "due_at")
    private LocalDateTime dueAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private WorkRecordStatus status = WorkRecordStatus.PROCESSING;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "workRecord")
    @Builder.Default
    private List<WorkRecordMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "workRecord")
    @Builder.Default
    private List<WorkRecordItem> items = new ArrayList<>();

    private String attachmentPath;
    private String attachmentName;
}