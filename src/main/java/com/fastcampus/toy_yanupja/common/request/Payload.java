package com.fastcampus.toy_yanupja.common.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class Payload<T> extends BaseRequest {
    @NotNull
    private T content;
}
