package com.qlvb.mofa.dto.request;

import com.qlvb.mofa.dto.enums.DocumentClassification;
import com.qlvb.mofa.dto.enums.GroupType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FrequentGroupSearchRequest {

    private String keyword;

    private DocumentClassification documentClassification;

    private GroupType groupType;

    private Byte status;
}