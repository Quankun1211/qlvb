package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.GroupMember;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMemberRepository
        extends JpaRepository<GroupMember, Long> {

    List<GroupMember> findAllByGroupId(Long groupId);

    void deleteAllByGroupId(Long groupId);

    boolean existsByGroupIdAndUnitId(
            Long groupId,
            Long unitId
    );

    boolean existsByGroupIdAndDepartmentId(
            Long groupId,
            Long departmentId
    );

    boolean existsByGroupIdAndUserId(
            Long groupId,
            Long userId
    );
    List<GroupMember> findAllByGroupIdOrderByIdAsc(Long groupId);
}