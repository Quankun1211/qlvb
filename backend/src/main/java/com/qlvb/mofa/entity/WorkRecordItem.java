package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "work_record_items",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_work_record_item",
            columnNames = {"work_record_id", "work_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkRecordItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_record_id", nullable = false)
    private WorkRecord workRecord;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_id", nullable = false)
    private Work work;
}