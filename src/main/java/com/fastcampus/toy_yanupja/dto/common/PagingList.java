package com.fastcampus.toy_yanupja.dto.common;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

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
