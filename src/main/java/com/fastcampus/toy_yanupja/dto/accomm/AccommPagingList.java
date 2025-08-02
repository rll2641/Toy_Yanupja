package com.fastcampus.toy_yanupja.dto.accomm;

import com.fastcampus.toy_yanupja.common.paging.PagingList;
import com.fastcampus.toy_yanupja.common.paging.PagingModel;

import java.util.List;

public class AccommPagingList extends PagingList<AccommDTO> {

    public AccommPagingList(Long total, List<AccommDTO> list) {
        super(total, list);
    }

    public AccommPagingList(Long total, PagingModel pagingModel, List<AccommDTO> list) {
        super(total, pagingModel, list);
    }
}
