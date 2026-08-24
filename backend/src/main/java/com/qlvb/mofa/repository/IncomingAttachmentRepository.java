package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.IncomingAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncomingAttachmentRepository
        extends JpaRepository<IncomingAttachment, Long> {

    List<IncomingAttachment> findAllByIncomingDocumentIdOrderByCreatedAtDesc(
            Long incomingDocumentId
    );
}