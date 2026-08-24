package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.qlvb.mofa.dto.enums.DocumentClassification;
import com.qlvb.mofa.dto.enums.GroupType;

@Entity
@Table(
    name = "frequent_groups",
    indexes = {
        @Index(name = "idx_groups_classification", columnList = "document_classification"),
        @Index(name = "idx_groups_type", columnList = "group_type")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FrequentGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "short_name", length = 100)
    private String shortName;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_classification", nullable = false, length = 30)
    private DocumentClassification documentClassification;

    @Enumerated(EnumType.STRING)
    @Column(name = "group_type", nullable = false, length = 30)
    private GroupType groupType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Byte status = 1;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "group")
    @Builder.Default
    private List<GroupMember> members = new ArrayList<>();
}