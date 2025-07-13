package com.fastcampus.toy_yanupja.common.paging;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Min;

@Getter
@Setter
public class PagingModel {

    @Min(value = 1, message = "페이지 번호는 1 이상이어야 합니다.")
    private Long pageIdx;
    private Integer count;
    private String orderBy;
    private String orderDirection;

    public Long getOffset() {
        if (pageIdx == null || pageIdx < 1) {
            return 0L;
        }
        return (pageIdx - 1) * count;
    }

    public boolean isPageValid() {
        return pageIdx != null && pageIdx > 0 && count != null && count > 0;
    }

}
