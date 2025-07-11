package com.fastcampus.toy_yanupja.dto.accomm.enums;

/*
* ACTIVE : 운영중
* INACTIVE : 임시 운영 중단
* SUSPENDED : 중단 상태
* */
public enum AccommodationStatus {
    ACTIVE("ACTIVE"),
    INACTIVE("INACTIVE"),
    SUSPENDED("SUSPENDED");

    private final String value;

    AccommodationStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static AccommodationStatus findValue(String value) {
        for (AccommodationStatus status : AccommodationStatus.values()) {
            if (status.getValue().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown value : " + value);
    }
}
