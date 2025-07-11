<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>야눕자 메인 페이지</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/header.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/index.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/footer.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/slider.css" />
</head>
<body>

<%@ include file="/WEB-INF/views/common/header.jsp" %>

<main>
    <!-- 공지사항 영역 -->
    <div class="notice-banner">
        <c:choose>
            <c:when test="${not empty latestNotice}">
                <a href="${pageContext.request.contextPath}/notice/${latestNotice.noticeId}" class="notice-tag" target="_blank">공지</a>
                <a href="${pageContext.request.contextPath}/notice/${latestNotice.noticeId}" class="notice-text" target="_blank">
                        ${latestNotice.title}
                </a>
            </c:when>
            <c:otherwise>
                <span class="notice-tag">공지</span>
                <span class="notice-text">등록된 공지사항이 없습니다.</span>
            </c:otherwise>
        </c:choose>
    </div>

    <section class="section">
        <!-- 카테고리 박스 영역 -->
        <div class="category-boxes">
            <a href="${pageContext.request.contextPath}/domestic" class="category-box">
                <img src="${pageContext.request.contextPath}/resources/image/hotel1.png" alt="국내숙소" />
                <p>국내숙소</p>
            </a>
            <a href="${pageContext.request.contextPath}/international" class="category-box">
                <img src="${pageContext.request.contextPath}/resources/image/hotel1.png" alt="해외숙소" />
                <p>해외숙소</p>
            </a>
            <a href="${pageContext.request.contextPath}/nearby" class="category-box">
                <img src="${pageContext.request.contextPath}/resources/image/hotel1.png" alt="내주변" />
                <p>내주변</p>
            </a>
        </div>

        <!-- 이벤트 슬라이더 -->
        <div class="slider-container event-slider" data-slider-type="event">
            <h2>이벤트</h2>
            <div class="slider-wrapper">
                <button class="slider-btn prev-btn">&#10094;</button>
                <div class="slider-track">
                    <c:forEach var="event" items="${eventList}">
                        <div class="slider-item">
                            <a href="${pageContext.request.contextPath}/event/${event.eventId}">
                                <img src="${pageContext.request.contextPath}${event.eventImagePath}" alt="${event.eventTitle}" />
                            </a>
                        </div>
                    </c:forEach>
                </div>
                <button class="slider-btn next-btn">&#10095;</button>
            </div>
        </div>

        <!-- 관심이 많은 숙소 슬라이더 -->
        <div class="slider-container hot-slider" data-slider-type="hot">
            <h2>관심이 많은 숙소</h2>
            <p>조회수가 많은 숙소 Top 10</p>
            <div class="slider-wrapper">
                <button class="slider-btn prev-btn">&#10094;</button>
                <div class="slider-track">
                    <c:forEach var="accomm" items="${topViewedList}">
                        <div class="slider-item">
                            <a href="${pageContext.request.contextPath}/domestic/hotel/${accomm.accommodationId}">
                                <c:choose>
                                    <c:when test="${empty accomm.accommodationImageFilePath}">
                                        <img src="${pageContext.request.contextPath}/resources/image/hotel_default.png"
                                             alt="${accomm.accommodationName}" />
                                    </c:when>
                                    <c:otherwise>
                                        <img src="${pageContext.request.contextPath}${accomm.accommodationImageFilePath}"
                                             alt="${accomm.accommodationName}" />
                                    </c:otherwise>
                                </c:choose>
                            </a>
                            <div class="slider-item-title">
                                    ${accomm.accommodationName}
                            </div>
                        </div>
                    </c:forEach>
                </div>
                <button class="slider-btn next-btn">&#10095;</button>
            </div>
        </div>

        <!-- 인기 숙소 슬라이더 -->
        <div class="slider-container popular-slider" data-slider-type="popular">
            <h2>많이 찾는 숙소</h2>
            <p>주간 인기 숙소 Top 10</p>
            <div class="slider-wrapper">
                <button class="slider-btn prev-btn">&#10094;</button>
                <div class="slider-track">
                    <c:forEach var="accomm" items="${weeklyPopularList}">
                        <div class="slider-item">
                            <a href="${pageContext.request.contextPath}/domestic/hotel/${accomm.accommodationId}">
                                <c:choose>
                                    <c:when test="${empty accomm.accommodationImageFilePath}">
                                        <img src="${pageContext.request.contextPath}/resources/image/hotel_default.png"
                                             alt="${accomm.accommodationName}" />
                                    </c:when>
                                    <c:otherwise>
                                        <img src="${pageContext.request.contextPath}${accomm.accommodationImageFilePath}"
                                             alt="${accomm.accommodationName}" />
                                    </c:otherwise>
                                </c:choose>
                            </a>
                            <div class="slider-item-title">
                                    ${accomm.accommodationName}
                            </div>
                        </div>
                    </c:forEach>
                </div>
                <button class="slider-btn next-btn">&#10095;</button>
            </div>
        </div>
    </section>
</main>

<%@ include file="/WEB-INF/views/common/footer.jsp" %>

<!-- 공통 스크립트 -->
<script src="${pageContext.request.contextPath}/resources/js/common/slider.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/common/search.js"></script>

<script>
    // 페이지 로드 시 초기화
    document.addEventListener('DOMContentLoaded', function() {
        // 슬라이더 초기화
        SliderManager.initializeAllSliders();

        // 검색 기능 초기화
        SearchManager.initialize('${pageContext.request.contextPath}');

        // 기타 페이지별 초기화 로직
        initializeIndexPage();
    });

    function initializeIndexPage() {
        // 인덱스 페이지 전용 초기화 로직
        console.log('Index page initialized');
    }
</script>
</body>
</html>