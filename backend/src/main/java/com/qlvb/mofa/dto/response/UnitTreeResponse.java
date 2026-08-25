package com.qlvb.mofa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitTreeResponse {
    private Long id;
    private String code;
    private String name;
    private String shortName;
    private String unitType;
    private List<UnitTreeResponse> children;
}