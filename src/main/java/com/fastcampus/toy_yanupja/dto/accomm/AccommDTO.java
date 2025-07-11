package com.fastcampus.toy_yanupja.dto.accomm;

import com.fastcampus.toy_yanupja.dto.AuditInfoDTO;
import lombok.*;

@Getter
@Setter
public class AccommDTO {

    private Integer accommodationId;
    private Integer sellerId;
    private Integer adminId;
    private Integer accommodationCategoryL1Id;
    private Integer accommodationCategoryL2Id;
    private Integer accommodationCategoryL3Id;
    private String accommodationName;
    private String accommodationStatus;
    private Integer clickViews;
    private String rating;
    private String provinceName;
    private String districtName;
    private String roadName;
    private Integer buildingNumber;
    private Integer buildingSubNumber;
    private AuditInfoDTO auditInfoDTO;
}