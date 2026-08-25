package com.qlvb.mofa.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "files",
    indexes = {
        @Index(name = "idx_files_entity", columnList = "entity_type,entity_id"),
        @Index(name = "idx_files_hash", columnList = "file_hash")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false, length = 500)
    private String fileName;

    @Column(name = "storage_path", nullable = false, length = 1000)
    private String storagePath;

    @Column(name = "mime_type", length = 150)
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_hash", length = 128)
    private String fileHash;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(name = "entity_type", length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}