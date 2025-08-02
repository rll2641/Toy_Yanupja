package com.fastcampus.toy_yanupja.common.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import javax.validation.constraints.*;
import java.time.LocalDateTime;

/* * BaseRequest 클래스는 모든 요청의 기본 구조를 정의합니다.
 * 요청 ID, 타임스탬프, 클라이언트 버전 정보를 포함합니다.
 * 요청 ID는 필수이며, 타임스탬프는 ISO 8601 형식으로 지정됩니다.
 * 클라이언트 버전은 "x.x.x" 형식을 따라야 합니다.
 */
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
