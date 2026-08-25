package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.WorkRecordMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface WorkRecordMemberRepository 
        extends JpaRepository<WorkRecordMember, Long>, 
                JpaSpecificationExecutor<WorkRecordMember> {
}