package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "group_members",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_group_member_unit",
            columnNames = {"group_id", "unit_id"}
        ),
        @UniqueConstraint(
            name = "uk_group_member_department",
            columnNames = {"group_id", "department_id"}
        ),
        @UniqueConstraint(
            name = "uk_group_member_user",
            columnNames = {"group_id", "user_id"}
        )
    },
    indexes = {
        @Index(name = "idx_group_members_group", columnList = "group_id"),
        @Index(name = "idx_group_members_user", columnList = "user_id"),
        @Index(name = "idx_group_members_department", columnList = "department_id"),
        @Index(name = "idx_group_members_unit", columnList = "unit_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private FrequentGroup group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}