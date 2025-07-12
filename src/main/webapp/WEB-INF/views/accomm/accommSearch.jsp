<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>숙소 검색</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/header.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common/footer.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/accomm/accommSearch.css">
</head>
<body>

<!-- 헤더 include -->
<%@ include file="/WEB-INF/views/common/header.jsp" %>

<!-- 검색 컨트롤 영역 -->
<div class="search-controls-container">
  <div class="search-controls">
    <!-- 날짜/인원 선택 버튼 -->
    <button class="control-button" id="datePersonBtn">
      <span class="calendar-icon">📅</span>
      <span id="datePersonText">07.11-07.12 · 2명</span>
    </button>

    <!-- 필터 버튼 -->
    <button class="control-button" id="filterBtn">
      <span class="filter-icon">⚙️</span>
      <span>필터</span>
    </button>

    <!-- 정렬 버튼 -->
    <button class="control-button" id="sortBtn">
      <span class="sort-icon">↕️</span>
      <span id="sortText">정렬</span>
    </button>
  </div>
</div>

<!-- 날짜/인원 선택 모달 -->
<div class="modal" id="datePersonModal">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">날짜, 인원 선택</h2>
      <button class="close-btn" onclick="closeModal('datePersonModal')">&times;</button>
    </div>

    <!-- 날짜 선택 섹션 -->
    <div class="date-section">
      <div class="date-header">
        <span class="calendar-icon">📅</span>
        <span class="date-text">07.11(금)~07.12(토) · 1박</span>
        <button class="change-btn" onclick="showCalendar()">변경하기</button>
      </div>
    </div>

    <!-- 캘린더 (처음엔 숨김) -->
    <div class="calendar-container" id="calendarContainer" style="display: none;">
      <div class="calendar-header">
        <button class="nav-btn" onclick="prevMonth()">&lt;</button>
        <span class="month-year">2025.07</span>
        <button class="nav-btn" onclick="nextMonth()">&gt;</button>
      </div>
      <div class="calendar-grid">
        <div class="calendar-days">
          <div class="day-header">일</div>
          <div class="day-header">월</div>
          <div class="day-header">화</div>
          <div class="day-header">수</div>
          <div class="day-header">목</div>
          <div class="day-header">금</div>
          <div class="day-header">토</div>
        </div>
        <div class="calendar-dates" id="calendarDates">
          <!-- 날짜들이 동적으로 생성됨 -->
        </div>
      </div>
    </div>

    <!-- 인원 선택 섹션 -->
    <div class="person-section">
      <div class="person-header">
        <span class="person-icon">👥</span>
        <span>성인 2</span>
      </div>
      <div class="person-controls">
        <div class="person-row">
          <span class="person-label">성인</span>
          <div class="counter">
            <button class="counter-btn" onclick="decreaseCount('adult')">-</button>
            <span class="count" id="adultCount">2</span>
            <button class="counter-btn" onclick="increaseCount('adult')">+</button>
          </div>
        </div>
        <div class="person-row">
          <span class="person-label">아동</span>
          <div class="counter">
            <button class="counter-btn" onclick="decreaseCount('child')">-</button>
            <span class="count" id="childCount">0</span>
            <button class="counter-btn" onclick="increaseCount('child')">+</button>
          </div>
        </div>
      </div>
    </div>

    <button class="apply-btn" onclick="applyDatePerson()">적용하기</button>
  </div>
</div>

<!-- 필터 모달 -->
<div class="modal" id="filterModal">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">필터</h2>
      <button class="close-btn" onclick="closeModal('filterModal')">&times;</button>
    </div>

    <!-- 가격 범위 -->
    <div class="filter-section">
      <h3 class="filter-title">가격 범위</h3>
      <div class="price-info">성인 2, 아동 0, 1박 기준</div>
      <div class="price-range">
        <div class="price-inputs">
          <div class="price-input-group">
            <label>최소</label>
            <input type="number" id="minPrice" value="39900" class="price-input">
          </div>
          <div class="price-input-group">
            <label>최대</label>
            <input type="number" id="maxPrice" value="3300000" class="price-input">
          </div>
        </div>
      </div>
    </div>

    <!-- 호텔 성급 -->
    <div class="filter-section">
      <h3 class="filter-title">호텔 성급</h3>
      <div class="filter-options">
        <button class="filter-option" data-rating="5">5성급</button>
        <button class="filter-option" data-rating="4">4성급</button>
        <button class="filter-option" data-rating="3">3성급</button>
        <button class="filter-option" data-rating="2">2성급</button>
        <button class="filter-option" data-rating="1">1성급</button>
      </div>
    </div>

    <!-- 숙소 유형 -->
    <div class="filter-section">
      <h3 class="filter-title">숙소 유형</h3>
      <div class="filter-options">
        <button class="filter-option" data-accommodation="hotel">호텔</button>
        <button class="filter-option" data-accommodation="pension">독채펜션</button>
        <button class="filter-option" data-accommodation="camping">글램핑</button>
        <button class="filter-option" data-accommodation="residence">레지던스</button>
      </div>
    </div>

    <button class="apply-btn" onclick="applyFilter()">적용하기</button>
  </div>
</div>

<!-- 정렬 모달 -->
<div class="modal" id="sortModal">
  <div class="modal-content sort-modal">
    <div class="modal-header">
      <h2 class="modal-title">정렬</h2>
      <button class="close-btn" onclick="closeModal('sortModal')">&times;</button>
    </div>

    <div class="sort-options">
      <div class="sort-option active" data-sort="rating">
        <span>평점 높은 순</span>
        <span class="check-icon">✓</span>
      </div>
      <div class="sort-option" data-sort="price-low">
        <span>가격 낮은 순</span>
      </div>
      <div class="sort-option" data-sort="price-high">
        <span>가격 높은 순</span>
      </div>
      <div class="sort-option" data-sort="review-good">
        <span>후기 좋은 순</span>
      </div>
      <div class="sort-option" data-sort="review-many">
        <span>후기 많은 순</span>
      </div>
      <div class="sort-option" data-sort="distance">
        <span>거리 가까운 순</span>
      </div>
    </div>
  </div>
</div>

<!-- 숙소 목록 영역 -->
<div class="accommodation-results">
  <div class="results-header">
    <span class="result-count" id="resultCount">총 ${accommodationPagingList.total}개의 숙소</span>
  </div>

  <!-- 로딩 스피너 -->
  <div class="loading" id="loadingSpinner" style="display: none;">
    <span>검색 중...</span>
  </div>

  <!-- 숙소 카드 그리드 (3x2) -->
  <div class="accommodation-grid" id="accommodationGrid">
    <c:forEach var="accommodation" items="${accommodationPagingList.list}" varStatus="status">
      <div class="accommodation-card" onclick="goToDetail('${accommodation.accommodationId}')">
        <div class="card-image">
          <img src="${accommodation.imageUrl}" alt="${accommodation.accommodationName}">
        </div>
        <div class="card-content">
          <div class="hotel-grade">${accommodation.grade}</div>
          <h3 class="hotel-name">${accommodation.accommodationName}</h3>
          <div class="hotel-location">📍 ${accommodation.location}</div>
          <div class="hotel-rating">
            <span class="rating">⭐ ${accommodation.rating}</span>
            <span class="review-count">(${accommodation.reviewCount})</span>
          </div>
          <div class="hotel-time">${accommodation.checkInTime}</div>
          <div class="hotel-price">
            <c:if test="${accommodation.discountRate > 0}">
              <span class="discount">${accommodation.discountRate}%</span>
              <span class="original-price">${accommodation.originalPrice}</span>
            </c:if>
            <div class="final-price">
              <c:if test="${accommodation.discountRate > 0}">
                <span class="label">최대할인가</span>
              </c:if>
              <span class="price">${accommodation.finalPrice}원~</span>
            </div>
          </div>
          <div class="hotel-features">
            <c:forEach var="feature" items="${accommodation.features}">
              <span class="feature">${feature}</span>
            </c:forEach>
          </div>
        </div>
      </div>
    </c:forEach>

    <!-- 데이터가 없을 때 -->
    <c:if test="${empty accommodationPagingList.list}">
      <div class="no-results">
        <p>조건에 맞는 숙소가 없습니다.</p>
      </div>
    </c:if>
  </div>

  <!-- 페이지네이션 -->
  <c:if test="${not empty accommodationPagingList.list and accommodationPagingList.total > 6}">
    <div class="pagination" id="pagination">
      <!-- 이전 페이지 버튼 -->
      <c:if test="${accommodationPagingList.pageIdx > 1}">
        <button class="page-btn prev" onclick="goToPage(${accommodationPagingList.pageIdx - 1})">&lt;</button>
      </c:if>

      <!-- 페이지 번호들 -->
      <c:set var="startPage" value="${accommodationPagingList.pageIdx - 2 > 0 ? accommodationPagingList.pageIdx - 2 : 1}" />
      <c:set var="totalPages" value="${(accommodationPagingList.total + 5) / 6}" />
      <c:set var="endPage" value="${accommodationPagingList.pageIdx + 2 < totalPages ? accommodationPagingList.pageIdx + 2 : totalPages}" />

      <c:forEach var="pageNum" begin="${startPage}" end="${endPage}">
        <button class="page-btn ${pageNum eq accommodationPagingList.pageIdx ? 'active' : ''}"
                onclick="goToPage(${pageNum})">${pageNum}</button>
      </c:forEach>

      <!-- 다음 페이지 버튼 -->
      <c:if test="${accommodationPagingList.hasNext}">
        <button class="page-btn next" onclick="goToPage(${accommodationPagingList.pageIdx + 1})">&gt;</button>
      </c:if>
    </div>
  </c:if>
</div>

<%@ include file="/WEB-INF/views/common/footer.jsp" %>

<!-- JavaScript -->
<script src="${pageContext.request.contextPath}/resources/js/accomm/accommSearch.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/common/search.js"></script>

</body>
</html>