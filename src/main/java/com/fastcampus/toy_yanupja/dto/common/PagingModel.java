package com.fastcampus.toy_yanupja.dto.common;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PagingModel {

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
