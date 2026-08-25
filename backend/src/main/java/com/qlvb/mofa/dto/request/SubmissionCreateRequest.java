package com.qlvb.mofa.dto.request;

import com.qlvb.mofa.dto.enums.SubmissionStatus;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
public class SubmissionCreateRequest {

    private String submissionNumber; 
    
    private Long documentId; 
    
    private String subject; 
    
    private Long departmentId; 
    
    private Long draftedById; 
    
    private String target; 
    
    private Long targetLeaderId; 
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate submittedAt; 
    
    private List<Long> attachmentFileIds;
}