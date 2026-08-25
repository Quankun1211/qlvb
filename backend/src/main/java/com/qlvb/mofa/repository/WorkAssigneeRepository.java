package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.WorkAssignee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface WorkAssigneeRepository 
        extends JpaRepository<WorkAssignee, Long>, 
                JpaSpecificationExecutor<WorkAssignee> {
    
    List<WorkAssignee> findByUserId(Long userId);
    
}