package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByEntityTypeAndEntityId(String entityType, Long entityId);
}