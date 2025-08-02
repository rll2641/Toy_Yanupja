package com.fastcampus.toy_yanupja.common.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/* * Payload 클래스는 요청의 본문을 나타내며, 제네릭 타입 T를 사용하여 다양한 데이터 타입을 지원합니다.
 * content 필드는 요청의 실제 데이터를 포함하며, null이 될 수 없습니다.
 */
@Getter
@Setter
public class Payload<T> extends BaseRequest {
    @NotNull
    private T content;
}
