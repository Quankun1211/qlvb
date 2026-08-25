package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.OutgoingRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OutgoingRecipientRepository 
        extends JpaRepository<OutgoingRecipient, Long>, 
                JpaSpecificationExecutor<OutgoingRecipient> {

    @Query("SELECT r FROM OutgoingRecipient r WHERE r.outgoingDocument.id = :documentId")
    List<OutgoingRecipient> findByOutgoingDocumentId(@Param("documentId") Long documentId);
}