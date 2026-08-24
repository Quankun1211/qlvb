package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "outgoing_recipients",
    indexes = {
        @Index(
            name = "idx_outgoing_recipient_document",
            columnList = "outgoing_document_id"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutgoingRecipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "outgoing_document_id", nullable = false)
    private OutgoingDocument outgoingDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private FrequentGroup group;

    @Column(name = "recipient_type", nullable = false, length = 50)
    private String recipientType;

    @Column(name = "delivery_status", length = 50)
    private String deliveryStatus;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;
}