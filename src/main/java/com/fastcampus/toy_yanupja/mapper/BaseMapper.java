package com.fastcampus.toy_yanupja.mapper;

import com.fastcampus.toy_yanupja.dto.accomm.AccommDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/*
* 공통 CRUD, 페이지네이션 처리 매퍼
* */
public interface BaseMapper<T, ID> {

    int insert(T dto);
    int update(T dto);
    int deleteById(ID id);
    T selectById(ID id);
    List<T> selectAll();

    List<T> selectByPage(T dto);
    long count();
}