package com.qlvb.mofa.service;

import com.qlvb.mofa.dto.response.UnitTreeResponse;
import com.qlvb.mofa.entity.Unit;
import com.qlvb.mofa.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository unitRepository;

    @Transactional(readOnly = true)
    public List<UnitTreeResponse> getUnitTree() {
        List<Unit> rootUnits = unitRepository.findByParentIsNullAndStatus((byte) 1);
        
        return rootUnits.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private UnitTreeResponse mapToDTO(Unit unit) {
        List<UnitTreeResponse> childDtos = null;
        if (unit.getChildren() != null && !unit.getChildren().isEmpty()) {
            childDtos = unit.getChildren().stream()
                    .filter(child -> child.getStatus() != null && child.getStatus() == 1)
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }

        return UnitTreeResponse.builder()
                .id(unit.getId())
                .code(unit.getCode())
                .name(unit.getName())
                .shortName(unit.getShortName())
                .unitType(unit.getUnitType())
                .children(childDtos)
                .build();
    }
}