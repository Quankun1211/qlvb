package com.qlvb.mofa.dto.request;

import com.qlvb.mofa.dto.enums.DocumentClassification;
import com.qlvb.mofa.dto.enums.GroupType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFrequentGroupRequest {

    @NotBlank(message = "Tên nhóm không được để trống")
    @Size(max = 255, message = "Tên nhóm tối đa 255 ký tự")
    private String name;

    @Size(max = 100, message = "Tên viết tắt tối đa 100 ký tự")
    private String shortName;

    private String description;

    @NotNull(message = "Phân loại nhóm không được để trống")
    private DocumentClassification documentClassification;

    @NotNull(message = "Phân loại dữ liệu không được để trống")
    private GroupType groupType;

    @NotEmpty(message = "Phải chọn ít nhất một thành viên")
    private List<Long> memberIds;
}