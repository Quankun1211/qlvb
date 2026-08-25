package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.DraftComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DraftCommentRepository extends JpaRepository<DraftComment, Long> {
    List<DraftComment> findByDraftDocumentId(Long draftDocumentId);
}