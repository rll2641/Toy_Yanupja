package com.fastcampus.toy_yanupja.common.paging;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

/* * PagingList 클래스는 페이지네이션된 데이터를 나타내며, 총 항목 수, 현재 페이지의 항목 리스트, 페이지 인덱스, 다음 페이지 여부를 포함합니다.
 * 생성자는 총 항목 수와 항목 리스트를 받아 초기화하며, PagingModel을 통해 페이지 인덱스와 다음 페이지 여부를 설정할 수 있습니다.
 */
@Getter
public abstract class PagingList<T> {

    private Long total;
    private List<T> list;
    private Long pageIdx;
    private Boolean hasNext;

    public PagingList(Long total, List<T> list) {
        this(total, null, list);
    }

    public PagingList(Long total, PagingModel pagingModel, List<T> list) {
        this.total = total;

        if (pagingModel != null && pagingModel.isPageValid()) {
            this.pageIdx = pagingModel.getPageIdx();
            this.hasNext = total > (pagingModel.getOffset() + pagingModel.getCount());
        }

        this.list = list;
        if (this.list == null)
            this.list = new ArrayList<>();
    }

}