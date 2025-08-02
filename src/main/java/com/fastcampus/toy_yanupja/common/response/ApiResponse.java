package com.fastcampus.toy_yanupja.common.response;

import lombok.Builder;
import lombok.Getter;

/* * ApiResponse 클래스는 API 응답의 기본 구조를 정의합니다.
 * 성공 여부, 메시지, 데이터, 에러 코드를 포함합니다.
 * 성공 응답과 에러 응답을 생성하는 정적 메서드를 제공합니다.
 */
@Getter
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private String errorCode;

    /* 성공 응답 */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    /* 성공 응답 (메시지) */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    /* 에러 응답 생성 */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }

    /* 에러 응답 (에러코드) */
    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .build();
    }
}
