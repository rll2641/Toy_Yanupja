package com.fastcampus.toy_yanupja.dto.accomm;

import com.fastcampus.toy_yanupja.dto.common.AuditInfoDTO;
import com.fastcampus.toy_yanupja.dto.accomm.enums.AccommodationStatus;
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
    private AccommodationStatus accommodationStatus;
    private Integer clickViews;
    private String rating;
    private String provinceName;
    private String districtName;
    private String roadName;
    private Integer buildingNumber;
    private Integer buildingSubNumber;
    private AuditInfoDTO auditInfoDTO;

    /* AccommSearch 검색 결과 */
    private String accommodationImageFilePath;
    private Integer reviewCount;
    private Double reviewScore;
    private String checkinTime;
    private Integer price;
    private Double discountRate;
    private Integer priceFinal;
}