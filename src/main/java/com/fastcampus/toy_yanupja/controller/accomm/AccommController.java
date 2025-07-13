package com.fastcampus.toy_yanupja.controller.accomm;

import com.fastcampus.toy_yanupja.common.paging.PagingList;
import com.fastcampus.toy_yanupja.common.request.Payload;
import com.fastcampus.toy_yanupja.common.response.ApiResponse;
import com.fastcampus.toy_yanupja.dto.accomm.AccommDTO;
import com.fastcampus.toy_yanupja.dto.accomm.AccommSearchRequest;
import com.fastcampus.toy_yanupja.service.accomm.AccommService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/domestic")
@Slf4j
public class AccommController {

    private final AccommService service;

    public AccommController(AccommService service) {
        this.service = service;
    }

    /* 카테고리 */
    @GetMapping
    public String CategoryAccomm() {
        return "accomm/accommCategory";
    }

    @GetMapping("/search")
    public String SearchAccomm() {
        log.info("검색 페이지 요청");
        return "accomm/accommSearch";
    }

    @PostMapping("/search")
    @ResponseBody
    public ResponseEntity<ApiResponse<PagingList<AccommDTO>>> searchAccomms(
            @RequestBody Payload<AccommSearchRequest> payload) {

        log.info("검색 페이지 POST 요청");
        return service.searchAccommByPage(payload);
    }

}
