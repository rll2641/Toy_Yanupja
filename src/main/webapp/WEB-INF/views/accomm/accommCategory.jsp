<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
    <title>숙소 종류 선택</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/header.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/footer.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/slider.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/accomm/accommCategory.css" />
</head>
<body>
<%@ include file="/WEB-INF/views/common/header.jsp" %>

<div class="category-container">
    <a href="${pageContext.request.contextPath}/domestic/hotel" class="category-card">
        <img src="${pageContext.request.contextPath}/resources/images/hotel/category/hotel_category.png" alt="호텔/리조트">
        <div class="category-card-title">호텔/리조트</div>
    </a>

    <a href="${pageContext.request.contextPath}/domestic/hotel" class="category-card">
        <img src="${pageContext.request.contextPath}/resources/images/hotel/category/motel_category.png" alt="모텔">
        <div class="category-card-title">모텔</div>
    </a>

    <a href="${pageContext.request.contextPath}/domestic/hotel" class="category-card">
        <img src="${pageContext.request.contextPath}/resources/images/hotel/category/pension_category.png" alt="펜션/풀빌라">
        <div class="category-card-title">펜션/풀빌라</div>
    </a>

    <a href="${pageContext.request.contextPath}/domestic/hotel" class="category-card">
        <img src="${pageContext.request.contextPath}/resources/images/hotel/category/camping_category.png" alt="글램핑/캠핑">
        <div class="category-card-title">글램핑/캠핑</div>
    </a>
</div>

<%@ include file="/WEB-INF/views/common/footer.jsp" %>

<!-- 공통 스크립트 -->
<script src="${pageContext.request.contextPath}/resources/js/common/slider.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/common/search.js"></script>

</body>
</html>