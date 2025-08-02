package com.fastcampus.toy_yanupja.common.paging;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Min;

/* * PagingModel 클래스는 페이지네이션을 위한 모델로, 페이지 인덱스, 항목 수, 정렬 기준 등을 포함합니다.
 * 페이지 인덱스는 1부터 시작하며, 유효한 페이지인지 확인하는 메서드를 제공합니다.
 * getOffset 메서드는 현재 페이지에 대한 오프셋을 계산합니다.
 */
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
