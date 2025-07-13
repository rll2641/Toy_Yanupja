package com.fastcampus.toy_yanupja.service.accomm;

import com.fastcampus.toy_yanupja.common.paging.PagingList;
import com.fastcampus.toy_yanupja.common.request.Payload;
import com.fastcampus.toy_yanupja.common.response.ApiResponse;
import com.fastcampus.toy_yanupja.dto.accomm.AccommDTO;
import com.fastcampus.toy_yanupja.dto.accomm.AccommPagingList;
import com.fastcampus.toy_yanupja.dto.accomm.AccommSearchRequest;
import com.fastcampus.toy_yanupja.mapper.accomm.AccommMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class AccommService {

    private final AccommMapper mapper;

    public AccommService(AccommMapper mapper) {
        this.mapper = mapper;
    }

    /* 숙소 페이지네이션 */
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<PagingList<AccommDTO>>> searchAccommByPage(Payload<AccommSearchRequest> payload) {
        try {
            log.info("숙소 검색 중 ..");
            AccommSearchRequest searchRequest = payload.getContent();
            List<AccommDTO> accommDTOList = mapper.selectByPage(searchRequest);
            Long totalCount = mapper.selectByPageTotalCount(searchRequest);
            AccommPagingList accommPagingList = new AccommPagingList(totalCount, accommDTOList);
            log.info("숙소 검색 완료");

            return ResponseEntity.ok(ApiResponse.success(accommPagingList, "숙소 검색 완료"));
        } catch (Exception e) {
            log.warn("숙소 검색 중 오류 발생 : {}", e.getMessage());
            return ResponseEntity.status(500).body(ApiResponse.error("숙소 검색 중 오류 발생"));
        }
    }
}
