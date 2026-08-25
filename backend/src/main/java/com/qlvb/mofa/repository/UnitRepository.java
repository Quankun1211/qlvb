package com.qlvb.mofa.repository;

import com.qlvb.mofa.entity.Unit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    List<Unit> findAllByIdInAndStatus(
            List<Long> ids,
            Byte status
    );

    List<Unit> findByParentIsNullAndStatus(Byte status);

    List<Unit> findByStatus(Byte status);

}