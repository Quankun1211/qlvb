package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "submission_comments",
    indexes = {
        @Index(name = "idx_submission_comments_submission", columnList = "submission_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_from_user_id")
    private User requestedFromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_from_unit_id")
    private Unit requestedFromUnit;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @Column(name = "due_at")
    private LocalDateTime dueAt;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    @Column(length = 50)
    private String status;
}