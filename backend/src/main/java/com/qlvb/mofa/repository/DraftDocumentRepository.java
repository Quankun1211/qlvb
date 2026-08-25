package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.DraftDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DraftDocumentRepository 
        extends JpaRepository<DraftDocument, Long>, 
                JpaSpecificationExecutor<DraftDocument> {
}