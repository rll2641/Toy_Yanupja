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

ㄴ 공통 응답, 요청 클래스 파일
