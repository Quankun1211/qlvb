package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "units",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_units_code", columnNames = "code")
    },
    indexes = {
        @Index(name = "idx_units_parent", columnList = "parent_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "short_name", length = 100)
    private String shortName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Unit parent;

    @OneToMany(mappedBy = "parent")
    @Builder.Default
    private List<Unit> children = new ArrayList<>();

    @Column(name = "unit_type", length = 50)
    private String unitType;

    @Column(nullable = false)
    private Byte status = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "unit")
    @Builder.Default
    private List<Department> departments = new ArrayList<>();

    @OneToMany(mappedBy = "unit")
    @Builder.Default
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "issuingUnit")
    @Builder.Default
    private List<Document> issuedDocuments = new ArrayList<>();

    @OneToMany(mappedBy = "receivingUnit")
    @Builder.Default
    private List<Document> receivingDocuments = new ArrayList<>();
}