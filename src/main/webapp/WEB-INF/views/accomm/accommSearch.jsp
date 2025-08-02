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
      <span id="datePersonText">날짜와 인원을 선택하세요</span>
    </button>

    <!-- 필터 버튼 -->
    <button class="control-button" id="filterBtn">
      <span class="filter-icon">⚙️</span>
      <span>필터</span>
    </button>

    <!-- 정렬 버튼 -->
    <button class="control-button" id="sortBtn">
      <span class="sort-icon">↕️</span>
      <span id="sortText">평점 높은 순</span>
    </button>
  </div>
</div>

<!-- 에러 메시지 표시 영역 -->
<div class="error-message" id="errorMessage" style="display: none;">
  <div class="error-content">
    <span class="error-icon">⚠️</span>
    <span class="error-text"></span>
    <button class="error-close" onclick="hideErrorMessage()">&times;</button>
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
        <span class="date-text" id="dateText">날짜를 선택하세요</span>
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
        <span id="personHeaderText">성인 2</span>
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
      <div class="price-info" id="priceInfo">성인 2, 아동 0, 1박 기준</div>
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
        <button class="filter-option" data-accommodation="hotel">호텔/리조트</button>
        <button class="filter-option" data-accommodation="pension">펜션</button>
        <button class="filter-option" data-accommodation="camping">글램핑</button>
        <button class="filter-option" data-accommodation="motel">모텔</button>
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
    </div>
  </div>
</div>

<!-- 숙소 목록 영역 - AJAX로 동적 렌더링 -->
<div class="accommodation-results">
  <div class="results-header">
    <span class="result-count" id="resultCount">
      숙소를 검색하고 있습니다...
    </span>
  </div>

  <!-- 로딩 스피너 -->
  <div class="loading" id="loadingSpinner" style="display: none;">
    <div class="loading-spinner"></div>
    <span>검색 중...</span>
  </div>

  <!-- 숙소 카드 그리드 - JavaScript에서 동적 생성 -->
  <div class="accommodation-grid" id="accommodationGrid">
    <!-- JavaScript로 동적 생성됨 -->
  </div>

  <!-- 페이지네이션 - JavaScript에서 동적 생성 -->
  <div class="pagination" id="pagination">
    <!-- JavaScript로 동적 생성됨 -->
  </div>
</div>

<%@ include file="/WEB-INF/views/common/footer.jsp" %>

<!-- JavaScript -->
<script src="${pageContext.request.contextPath}/resources/js/accomm/accommSearch.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/common/search.js"></script>

<!-- 유틸리티 함수들 -->
<script>
  // 에러 메시지 표시 함수
  function showErrorMessage(message) {
    const errorElement = document.getElementById('errorMessage');
    const errorText = errorElement.querySelector('.error-text');

    errorText.textContent = message;
    errorElement.style.display = 'block';

    // 5초 후 자동 숨김
    setTimeout(() => {
      hideErrorMessage();
    }, 5000);
  }

  // 에러 메시지 숨김 함수
  function hideErrorMessage() {
    document.getElementById('errorMessage').style.display = 'none';
  }

  // 날짜 유효성 검증 함수
  function validateDates(startDate, endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw new Error('체크인 날짜는 오늘 이후여야 합니다.');
    }

    if (endDate <= startDate) {
      throw new Error('체크아웃 날짜는 체크인 날짜 이후여야 합니다.');
    }

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    if (startDate > maxDate) {
      throw new Error('예약은 1년 이내로만 가능합니다.');
    }
  }
</script>

<script>
  const contextPath = '${pageContext.request.contextPath}';
</script>

</body>
</html>