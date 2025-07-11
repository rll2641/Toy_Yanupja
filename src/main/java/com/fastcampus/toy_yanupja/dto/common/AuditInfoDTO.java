package com.fastcampus.toy_yanupja.dto.common;

import lombok.*;

import java.time.LocalDateTime;

/* 시스템 컬럼 DTO */
@Getter
@Setter
public class AuditInfoDTO {
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer createdBy;
    private Integer updatedBy;
}
