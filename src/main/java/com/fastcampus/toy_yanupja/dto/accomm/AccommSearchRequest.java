package com.fastcampus.toy_yanupja.dto.accomm;

import com.fastcampus.toy_yanupja.common.paging.PagingModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class AccommSearchRequest {

    /* 초기 페이지 숙소 */
    private List<String> defaultArea;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @Min(value = 1, message = "성인 인원은 최소 1명이어야 합니다")
    @Max(value = 10, message = "성인 인원은 최대 10명입니다")
    private Integer adultCount;

    @Min(value = 0, message = "아동 인원은 0명 이상이어야 합니다")
    @Max(value = 10, message = "아동 인원은 최대 10명입니다")
    private Integer childCount;

    @Min(value = 0, message = "최소 금액은 0원 이상이어야 합니다")
    private Integer minPrice;
    private Integer maxPrice;
    private List<String> rating;
    private List<String> accommType;

    private PagingModel pagingModel;
}
