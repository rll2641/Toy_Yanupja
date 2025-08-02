# Toy_Yanupja

## Toy_Yanupja 리팩토링

### 마이바티스 추상화
```java

/*
* 공통 CRUD, 페이지네이션 처리 매퍼
* */
public interface BaseMapper<T, ID> {

    int insert(T dto);
    int update(T dto);
    int deleteById(ID id);
    T selectById(ID id);
    List<T> selectAll();
    long count();
}

```

### 마이바티스 타입 핸들러
```java

/**
 * AccommodationStatus Enum을 MyBatis에서 처리하기 위한 TypeHandler 클래스
 * <p>
 * AccommodationStatus Enum을 MyBatis에서 String으로 매핑하기 위해 BaseTypeHandler를 상속받아 구현합니다.
 * 이 클래스는 PreparedStatement에 값을 설정하고, ResultSet에서 값을 조회하는 메서드를 오버라이드합니다.
 */
@MappedTypes(AccommodationStatus.class) /* 처리할 자바 타입 지정 */
@MappedJdbcTypes(JdbcType.VARCHAR) /* 처리할 JDBC 타입 지정 */
public class AccommStatusTypeHandler extends BaseTypeHandler<AccommodationStatus> {

    /* Java -> DB : PreparedStatment에 값 설정 */
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
                                    AccommodationStatus parameter, JdbcType jdbcType) throws SQLException {
        /* Java Enum -> DB String 변환 */
        ps.setString(i, parameter.getValue());
    }

    // DB -> Java : ResultSet에서 컬럼명으로 값 조회
    @Override
    public AccommodationStatus getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value == null ? null : AccommodationStatus.findValue(value);
    }

    // DB -> Java : ResultSet에서 컬럼 인덱스로 값 조회
    @Override
    public AccommodationStatus getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value == null ? null : AccommodationStatus.findValue(value);
    }

    // DB -> Java : CallableStatement에서 값 조회
    @Override
    public AccommodationStatus getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return value == null ? null : AccommodationStatus.findValue(value);
    }
}

```


### 공통 요청 클래스
```java

/* * Payload 클래스는 요청의 본문을 나타내며, 제네릭 타입 T를 사용하여 다양한 데이터 타입을 지원한다.
 * content 필드는 요청의 실제 데이터를 포함하며, null이 될 수 없다.
 */
@Getter
@Setter
public class Payload<T> extends BaseRequest {
    @NotNull
    private T content;
}

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

```

### API 응답의 기본 구조 정의
```java

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

```

### 페이지네이션 추상화 클래스
```java

/* * PagingList 클래스는 페이지네이션된 데이터를 나타내며, 총 항목 수, 현재 페이지의 항목 리스트, 페이지 인덱스, 다음 페이지 여부를 포함합니다.
 * 생성자는 총 항목 수와 항목 리스트를 받아 초기화하며, PagingModel을 통해 페이지 인덱스와 다음 페이지 여부를 설정할 수 있습니다.
 */
@Getter
public abstract class PagingList<T> {

    private Long total;
    private List<T> list;
    private Long pageIdx;
    private Boolean hasNext;

    public PagingList(Long total, List<T> list) {
        this(total, null, list);
    }

    public PagingList(Long total, PagingModel pagingModel, List<T> list) {
        this.total = total;

        if (pagingModel != null && pagingModel.isPageValid()) {
            this.pageIdx = pagingModel.getPageIdx();
            this.hasNext = total > (pagingModel.getOffset() + pagingModel.getCount());
        }

        this.list = list;
        if (this.list == null)
            this.list = new ArrayList<>();
    }

}

/* * PagingModel 클래스는 페이지네이션을 위한 모델로, 페이지 인덱스, 항목 수, 정렬 기준 등을 포함합니다.
 * 페이지 인덱스는 1부터 시작하며, 유효한 페이지인지 확인하는 메서드를 제공합니다.
 * getOffset 메서드는 현재 페이지에 대한 오프셋을 계산합니다.
 */
@Getter
@Setter
public class PagingModel {

    @Min(value = 1, message = "페이지 번호는 1 이상이어야 합니다.")
    private Long pageIdx;
    private Integer count;
    private String orderBy;
    private String orderDirection;

    public Long getOffset() {
        if (pageIdx == null || pageIdx < 1) {
            return 0L;
        }
        return (pageIdx - 1) * count;
    }

    public boolean isPageValid() {
        return pageIdx != null && pageIdx > 0 && count != null && count > 0;
    }

}

```
