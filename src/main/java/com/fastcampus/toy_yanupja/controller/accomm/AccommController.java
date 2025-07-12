package com.fastcampus.toy_yanupja.controller.accomm;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/domestic")
public class AccommController {

    /* 카테고리 */
    @GetMapping
    public String CategoryAccomm() {
        return "accomm/accommCategory";
    }

    /* 조건에 맞는 숙소 보여주기 */
    @GetMapping("/search")
    public String SearchAccomm() {
        return "accomm/accommSearch";
    }
}
