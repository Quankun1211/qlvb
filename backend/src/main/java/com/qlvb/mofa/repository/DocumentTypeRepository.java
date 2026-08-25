package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, Long> {
    List<DocumentType> findByStatusOrderByNameAsc(Byte status);
    Optional<DocumentType> findByIdAndStatus(Long id, Byte status);
}
