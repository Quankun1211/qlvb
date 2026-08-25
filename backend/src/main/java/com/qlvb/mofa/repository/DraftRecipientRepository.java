package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.DraftRecipient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DraftRecipientRepository extends JpaRepository<DraftRecipient, Long> {
}
