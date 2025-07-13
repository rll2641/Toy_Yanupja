package com.fastcampus.toy_yanupja.mapper.accomm;

import com.fastcampus.toy_yanupja.dto.accomm.AccommDTO;
import com.fastcampus.toy_yanupja.dto.accomm.AccommSearchRequest;
import com.fastcampus.toy_yanupja.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/* 숙소 고유 SQL 선언 */
@Mapper
public interface AccommMapper extends BaseMapper<AccommDTO, Long> {

    List<AccommDTO> selectByPage(AccommSearchRequest request);
    Long selectByPageTotalCount(AccommSearchRequest request);
}
