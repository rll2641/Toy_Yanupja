package com.fastcampus.toy_yanupja.controller.accomm;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/domestic")
public class AccommController {

    @GetMapping
    public String CategoryAccomm() {
        return "accomm/accommCategory";
    }
}
