<%-- header.jsp fragment: included in other JSPs. No page directive here to avoid duplicate contentType errors. --%>
<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<header>

    <div class="logo">
        <a href="${pageContext.request.contextPath}/" style="text-decoration: none; color: inherit;">
            야눕자
        </a>
    </div>

    <div class="search-bar">
        <input type="text" id=searchInput placeholder="호텔 이름, 지역으로 검색해주세요" />
    </div>

    <div class="header-right">
        <%-- 로그인되지 않은 경우 (로그인/회원가입 메뉴 표시) --%>
        <c:if test="${empty sessionScope.loginCustomer}">
            <div class="auth-links">
                <a href="${pageContext.request.contextPath}/customer/login" class="icon-link">
                    <img src="${pageContext.request.contextPath}/resources/images/header/login_image.png" alt="로그인" />
                    <span>로그인</span>
                </a>
                <a href="${pageContext.request.contextPath}/customer" class="icon-link">
                    <img src="${pageContext.request.contextPath}/resources/images/header/signup_image.png" alt="회원가입" />
                    <span>회원가입</span>
                </a>
            </div>
        </c:if>

        <div class="icon-links">
            <%-- 로그인된 경우 (마이 페이지 메뉴 표시) --%>
            <c:if test="${not empty sessionScope.loginCustomer}">
                <a href="${pageContext.request.contextPath}/myPage" class="icon-link">
                    <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" alt="마이" />
                    <span>마이페이지</span>
                </a>
            </c:if>

            <a href="${pageContext.request.contextPath}/cart/list" class="icon-link">
                <img src="https://cdn-icons-png.flaticon.com/512/263/263142.png" alt="장바구니" />
                <span>장바구니</span>
            </a>
        </div>
        <div>
            <%-- 예약 내역 링크 --%>
            <a href="${pageContext.request.contextPath}/orders" class="icon-link">
                <img src="${pageContext.request.contextPath}/resources/images/header/reservation.png" alt="예약 내역" /> <%-- 장바구니와 동일한 이미지 사용 --%>
                <span>예약 내역</span>
            </a>
        </div>
    </div>
</header>