package com.fastcampus.toy_yanupja.common.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import javax.validation.constraints.*;
import java.time.LocalDateTime;

@Getter
@Setter
public class BaseRequest {

    @NotBlank(message = "요청 ID는 필수 입니다.")
    private String requestId;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime timestamp;
    @Pattern(regexp = "^\\d+\\.\\d+\\.\\d+$", message = "올바른 버전 형식이 아닙니다 (예: 1.0.0)")
    private String clientVersion;
}
