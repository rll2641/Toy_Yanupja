/**
 * 숙소 검색 컨트롤 관리자 (AJAX 중심 + Payload 구조)
 */
class AccommodationSearchController {
    constructor() {
        this.currentDate = new Date();
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.adultCount = 2;
        this.childCount = 0;
        this.currentSort = 'rating';
        this.currentPage = 1;
        this.isInitialSearch = true;  // 초기 검색 플래그 추가
        this.filters = {
            minPrice: 39900,
            maxPrice: 3300000,
            bookingType: 'booking',
            rating: [],
            accommodationType: []
        };

        this.initializeEvents();
        this.generateCalendar();
        this.setDefaultDates();

        // 페이지 로드 시 초기 검색 실행 (강남/역삼/삼성 지역)
        this.performSearch();
    }

    /**
     * 요청 ID 생성
     */
    generateRequestId() {
        return 'search_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * BaseRequest 정보 생성
     */
    createBaseRequest() {
        return {
            requestId: this.generateRequestId(),
            timestamp: new Date().toISOString(),
            clientVersion: "1.0.0"
        };
    }

    /**
     * 검색 요청 페이로드 생성
     */
    createSearchPayload() {
        const baseRequest = this.createBaseRequest();

        const searchContent = {
            startDate: this.selectedStartDate ? this.selectedStartDate.toISOString().split('T')[0] : null,
            endDate: this.selectedEndDate ? this.selectedEndDate.toISOString().split('T')[0] : null,
            adultCount: this.adultCount,
            childCount: this.childCount,
            minPrice: this.filters.minPrice,
            maxPrice: this.filters.maxPrice,
            rating: this.filters.rating,
            accommType: this.filters.accommodationType,
            // 초기 페이지용 기본 지역 조건 추가
            defaultArea: this.isInitialSearch ? ['강남', '역삼', '삼성'] : null,
            pagingModel: {
                orderBy: this.currentSort,
                pageIdx: this.currentPage,
                count: 6
            }
        };

        // null이나 빈 배열 값 제거
        Object.keys(searchContent).forEach(key => {
            if (searchContent[key] === null ||
                searchContent[key] === '' ||
                (Array.isArray(searchContent[key]) && searchContent[key].length === 0)) {
                delete searchContent[key];
            }
        });

        return {
            ...baseRequest,
            content: searchContent
        };
    }

    /**
     * 서버에 검색 요청
     */
    sendSearchRequest(payload) {
        console.log('🔍 검색 요청 시작');
        console.log('📍 요청 URL:', '/domestic/search');
        console.log('📦 페이로드:', JSON.stringify(payload, null, 2));

        this.showLoading(true);

        // 컨텍스트 경로 확인
        const contextPath = window.location.pathname.split('/')[1] || '';
        const requestUrl = contextPath ? `/${contextPath}/domestic/search` : '/domestic/search';

        console.log('🌐 최종 요청 URL:', requestUrl);
        console.log('📍 현재 도메인:', window.location.origin);

        fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                console.log('📡 응답 상태:', response.status, response.statusText);
                console.log('📡 응답 헤더:', [...response.headers.entries()]);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('✅ 검색 성공:', data);
                this.handleSearchResponse(data);
            })
            .catch(error => {
                console.error('❌ 검색 실패:', error);
                console.error('❌ 에러 스택:', error.stack);

                // 404 에러인 경우 추가 정보 제공
                if (error.message.includes('404')) {
                    console.error('🚨 404 에러 발생 - 확인사항:');
                    console.error('1. 서버가 실행 중인지 확인');
                    console.error('2. Controller 매핑이 올바른지 확인');
                    console.error('3. 컨텍스트 경로가 올바른지 확인');
                    console.error('4. 현재 URL:', window.location.href);
                }

                this.handleSearchError(error);
            })
            .finally(() => {
                this.showLoading(false);
            });
    }

    // 나머지 메서드들은 동일...
    /**
     * 이벤트 초기화
     */
    initializeEvents() {
        // 모달 열기 이벤트
        document.getElementById('datePersonBtn').addEventListener('click', () => {
            this.openModal('datePersonModal');
        });

        document.getElementById('filterBtn').addEventListener('click', () => {
            this.openModal('filterModal');
        });

        document.getElementById('sortBtn').addEventListener('click', () => {
            this.openModal('sortModal');
        });

        // 모달 외부 클릭 시 닫기
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // 필터 옵션 클릭 이벤트
        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleFilterOption(e.target);
            });
        });

        // 정렬 옵션 클릭 이벤트
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleSortOption(e.target);
            });
        });
    }

    /**
     * 기본 날짜 설정 (오늘과 내일)
     */
    setDefaultDates() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        this.selectedStartDate = today;
        this.selectedEndDate = tomorrow;

        this.updateDateDisplay();
        this.updateMainButtonText();
    }

    /**
     * 메인 버튼 텍스트 업데이트
     */
    updateMainButtonText() {
        if (this.selectedStartDate && this.selectedEndDate) {
            const start = this.formatDateShort(this.selectedStartDate);
            const end = this.formatDateShort(this.selectedEndDate);
            const total = this.adultCount + this.childCount;

            document.getElementById('datePersonText').textContent = `${start}-${end} · ${total}명`;
        }
    }

    /**
     * 모달 내 날짜 표시 업데이트
     */
    updateDateDisplay() {
        if (this.selectedStartDate && this.selectedEndDate) {
            const start = this.formatDate(this.selectedStartDate);
            const end = this.formatDate(this.selectedEndDate);
            const nights = Math.ceil((this.selectedEndDate - this.selectedStartDate) / (1000 * 60 * 60 * 24));

            const dateTextElement = document.querySelector('.date-text');
            if (dateTextElement) {
                dateTextElement.textContent = `${start}~${end} · ${nights}박`;
            }
        }
    }

    /**
     * 모달 열기
     */
    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    /**
     * 모달 닫기
     */
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    /**
     * 캘린더 표시/숨기기
     */
    showCalendar() {
        const calendar = document.getElementById('calendarContainer');
        calendar.style.display = calendar.style.display === 'none' ? 'block' : 'none';
    }

    /**
     * 캘린더 생성
     */
    generateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        document.querySelector('.month-year').textContent = `${year}.${String(month + 1).padStart(2, '0')}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const calendarDates = document.getElementById('calendarDates');
        calendarDates.innerHTML = '';

        // 이전 달의 빈 날짜들
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDate = document.createElement('div');
            emptyDate.classList.add('calendar-date', 'disabled');
            calendarDates.appendChild(emptyDate);
        }

        // 현재 달의 날짜들
        for (let day = 1; day <= daysInMonth; day++) {
            const dateElement = document.createElement('div');
            dateElement.classList.add('calendar-date');
            dateElement.textContent = day;
            dateElement.addEventListener('click', () => this.selectDate(new Date(year, month, day)));

            const currentDateObj = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (currentDateObj < today) {
                dateElement.classList.add('disabled');
                dateElement.style.pointerEvents = 'none';
            }

            if (this.selectedStartDate && this.selectedEndDate) {
                if (this.isSameDate(currentDateObj, this.selectedStartDate) ||
                    this.isSameDate(currentDateObj, this.selectedEndDate)) {
                    dateElement.classList.add('selected');
                }
            }

            calendarDates.appendChild(dateElement);
        }
    }

    /**
     * 날짜 선택
     */
    selectDate(date) {
        if (!this.selectedStartDate || (this.selectedStartDate && this.selectedEndDate)) {
            this.selectedStartDate = date;
            this.selectedEndDate = null;
        } else {
            if (date > this.selectedStartDate) {
                this.selectedEndDate = date;
            } else {
                this.selectedStartDate = date;
                this.selectedEndDate = null;
            }
        }

        this.generateCalendar();
        this.updateDateDisplay();
    }

    /**
     * 날짜 포맷팅 (상세)
     */
    formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = days[date.getDay()];

        return `${month}.${day}(${dayName})`;
    }

    /**
     * 날짜 포맷팅 (간단)
     */
    formatDateShort(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}.${day}`;
    }

    /**
     * 날짜 비교
     */
    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    /**
     * 이전 달
     */
    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.generateCalendar();
    }

    /**
     * 다음 달
     */
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.generateCalendar();
    }

    /**
     * 인원 수 증가
     */
    increaseCount(type) {
        if (type === 'adult') {
            this.adultCount++;
            document.getElementById('adultCount').textContent = this.adultCount;
        } else if (type === 'child') {
            this.childCount++;
            document.getElementById('childCount').textContent = this.childCount;
        }
        this.updatePersonDisplay();
    }

    /**
     * 인원 수 감소
     */
    decreaseCount(type) {
        if (type === 'adult' && this.adultCount > 1) {
            this.adultCount--;
            document.getElementById('adultCount').textContent = this.adultCount;
        } else if (type === 'child' && this.childCount > 0) {
            this.childCount--;
            document.getElementById('childCount').textContent = this.childCount;
        }
        this.updatePersonDisplay();
    }

    /**
     * 인원 표시 업데이트
     */
    updatePersonDisplay() {
        const personHeaderElement = document.querySelector('.person-header span:last-child');
        if (personHeaderElement) {
            personHeaderElement.textContent = `성인 ${this.adultCount}${this.childCount > 0 ? ', 아동 ' + this.childCount : ''}`;
        }
    }

    /**
     * 필터 옵션 처리
     */
    handleFilterOption(option) {
        const parent = option.parentElement;
        const isMultiSelect = parent.classList.contains('filter-options') &&
            (option.dataset.rating || option.dataset.accommodation);

        if (isMultiSelect) {
            option.classList.toggle('active');
        } else {
            parent.querySelectorAll('.filter-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        }
    }

    /**
     * 정렬 옵션 처리
     */
    handleSortOption(option) {
        document.querySelectorAll('.sort-option').forEach(opt => {
            opt.classList.remove('active');
            opt.querySelector('.check-icon')?.remove();
        });

        option.classList.add('active');
        const checkIcon = document.createElement('span');
        checkIcon.className = 'check-icon';
        checkIcon.textContent = '✓';
        option.appendChild(checkIcon);

        this.currentSort = option.dataset.sort;

        const sortText = option.querySelector('span:first-child').textContent;
        document.getElementById('sortText').textContent = sortText;

        // 모달 닫기
        this.closeModal('sortModal');

        // 정렬 변경 시 첫 페이지로 이동 후 검색
        this.currentPage = 1;
        this.performSearch();
    }

    /**
     * 날짜/인원 적용
     */
    applyDatePerson() {
        // 날짜 유효성 검증
        try {
            if (this.selectedStartDate && this.selectedEndDate) {
                this.validateDates(this.selectedStartDate, this.selectedEndDate);
            }
        } catch (error) {
            if (typeof showErrorMessage === 'function') {
                showErrorMessage(error.message);
            }
            return;
        }

        // 버튼 텍스트 업데이트
        this.updateMainButtonText();

        // 모달 닫기
        this.closeModal('datePersonModal');

        // 첫 페이지로 이동 후 검색
        this.currentPage = 1;
        this.performSearch();
    }

    /**
     * 필터 적용
     */
    applyFilter() {
        // 가격 범위 저장
        this.filters.minPrice = parseInt(document.getElementById('minPrice').value) || 0;
        this.filters.maxPrice = parseInt(document.getElementById('maxPrice').value) || 999999999;

        // 예약 유형 저장
        const activeBookingType = document.querySelector('.filter-option.active[data-type]');
        if (activeBookingType) {
            this.filters.bookingType = activeBookingType.dataset.type;
        }

        // 호텔 성급 저장
        this.filters.rating = [];
        document.querySelectorAll('.filter-option.active[data-rating]').forEach(option => {
            this.filters.rating.push(option.dataset.rating);
        });

        // 숙소 유형 저장
        this.filters.accommodationType = [];
        document.querySelectorAll('.filter-option.active[data-accommodation]').forEach(option => {
            this.filters.accommodationType.push(option.dataset.accommodation);
        });

        // 모달 닫기
        this.closeModal('filterModal');

        // 첫 페이지로 이동 후 검색
        this.currentPage = 1;
        this.performSearch();
    }

    /**
     * 검색 실행
     */
    performSearch() {
        const payload = this.createSearchPayload();
        console.log('검색 페이로드:', payload);
        this.sendSearchRequest(payload);

        // 첫 검색 이후에는 초기 검색 플래그 해제
        if (this.isInitialSearch) {
            this.isInitialSearch = false;
        }
    }

    /**
     * 검색 응답 처리 (ApiResponse 구조)
     */
    handleSearchResponse(response) {
        if (response.success) {
            // 성공 응답: response.data에 검색 결과가 담겨있음
            this.displaySearchResults(response.data);
            this.updateResultCount(response.data.total);

            // 성공 메시지가 있다면 표시 (선택사항)
            if (response.message) {
                console.log('검색 성공:', response.message);
            }
        } else {
            // 실패 응답: response.message와 response.errorCode 활용
            const errorMessage = response.message || '검색에 실패했습니다.';
            const errorCode = response.errorCode || 'UNKNOWN_ERROR';

            console.error('검색 실패:', errorMessage, '(코드:', errorCode, ')');
            this.handleSearchError(new Error(errorMessage), errorCode);
        }
    }

    /**
     * 검색 에러 처리 (ApiResponse 구조)
     */
    handleSearchError(error, errorCode = null) {
        console.error('검색 에러:', error);

        // 에러 메시지 구성
        let errorMessage = error.message || '검색 중 오류가 발생했습니다.';
        if (errorCode) {
            errorMessage += ` (오류코드: ${errorCode})`;
        }

        // 사용자에게 에러 메시지 표시
        if (typeof showErrorMessage === 'function') {
            showErrorMessage(errorMessage);
        }

        // 에러 상태 표시
        document.getElementById('accommodationGrid').innerHTML = `
            <div class="no-results">
                <div class="error-icon">⚠️</div>
                <p>검색 중 오류가 발생했습니다.</p>
                <p class="error-detail">${error.message}</p>
                ${errorCode ? `<p class="error-code">오류코드: ${errorCode}</p>` : ''}
                <button class="retry-btn" onclick="window.accommodationController.performSearch()">
                    다시 검색하기
                </button>
            </div>
        `;

        // 페이지네이션 숨김
        document.getElementById('pagination').innerHTML = '';

        // 결과 수 초기화
        document.getElementById('resultCount').textContent = '검색 결과가 없습니다.';
    }

    /**
     * 검색 결과 표시
     */
    displaySearchResults(resultData) {
        const accommodationGrid = document.getElementById('accommodationGrid');

        if (!resultData.list || resultData.list.length === 0) {
            accommodationGrid.innerHTML = `
                <div class="no-results">
                    <p>조건에 맞는 숙소가 없습니다.</p>
                    <button class="retry-btn" onclick="window.accommodationController.resetAndSearch()">
                        검색 조건 초기화
                    </button>
                </div>
            `;
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        // 숙소 카드들 생성
        const cardsHtml = resultData.list.map(accommodation => `
            <div class="accommodation-card" onclick="goToDetail('${accommodation.accommodationId}')">
                <div class="card-image">
                    <img src="${accommodation.accommodationFilePath || '/resources/images/common/hotel_default.png'}" 
                         alt="${accommodation.accommodationName}"
                         onerror="this.src='/resources/images/default-hotel.jpg'">
                </div>
                <div class="card-content">
                    <div class="hotel-grade">${accommodation.rating}</div>
                    <h3 class="hotel-name">${accommodation.accommodationName}</h3>
                    <div class="hotel-location">📍 ${accommodation.districtName} ${accommodation.roadName}</div>
                    <div class="hotel-rating">
                        <span class="rating">⭐ ${accommodation.reviewScore || 0}</span>
                        <span class="review-count">(${accommodation.reviewCount || 0})</span>
                    </div>
                    <div class="hotel-time">체크인 시간 ${accommodation.checkinTime || '15:00'}</div>
                    <div class="hotel-price">
                        ${accommodation.discountRate > 0 ? `
                            <span class="discount">${Math.round(accommodation.discountRate * 100)}%</span>
                            <span class="original-price">${this.formatPrice(accommodation.price)}원</span>
                        ` : ''}
                        <div class="final-price">
                            ${accommodation.discountRate > 0 ? '<span class="label">최대할인가</span>' : ''}
                            <span class="price">${this.formatPrice(accommodation.priceFinal)}원~</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        accommodationGrid.innerHTML = cardsHtml;
        this.updatePagination(resultData);
    }

    /**
     * 페이지네이션 업데이트
     */
    updatePagination(resultData) {
        const paginationElement = document.getElementById('pagination');

        if (resultData.total <= 6) {
            paginationElement.innerHTML = '';
            return;
        }

        const currentPage = resultData.pageIdx || 1;
        const totalPages = Math.ceil(resultData.total / 6);
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        let paginationHtml = '';

        // 이전 페이지 버튼
        if (currentPage > 1) {
            paginationHtml += `<button class="page-btn prev" onclick="window.accommodationController.goToPage(${currentPage - 1})">&lt;</button>`;
        }

        // 페이지 번호들
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationHtml += `<button class="page-btn ${activeClass}" onclick="window.accommodationController.goToPage(${i})">${i}</button>`;
        }

        // 다음 페이지 버튼
        if (currentPage < totalPages) {
            paginationHtml += `<button class="page-btn next" onclick="window.accommodationController.goToPage(${currentPage + 1})">&gt;</button>`;
        }

        paginationElement.innerHTML = paginationHtml;
    }

    /**
     * 페이지 이동
     */
    goToPage(pageNum) {
        this.currentPage = pageNum;
        this.performSearch();
    }

    /**
     * 검색 조건 초기화 후 검색
     */
    resetAndSearch() {
        // 필터 초기화
        this.filters = {
            minPrice: 39900,
            maxPrice: 3300000,
            bookingType: 'booking',
            rating: [],
            accommodationType: []
        };

        // UI 초기화
        document.getElementById('minPrice').value = 39900;
        document.getElementById('maxPrice').value = 3300000;
        document.querySelectorAll('.filter-option.active').forEach(opt => {
            opt.classList.remove('active');
        });

        // 정렬 초기화
        this.currentSort = 'rating';
        document.getElementById('sortText').textContent = '평점 높은 순';

        // 페이지 초기화
        this.currentPage = 1;

        // 검색 실행
        this.performSearch();
    }

    /**
     * 날짜 유효성 검증
     */
    validateDates(startDate, endDate) {
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

    /**
     * 결과 수 업데이트
     */
    updateResultCount(total) {
        const resultCountElement = document.getElementById('resultCount');
        if (resultCountElement) {
            resultCountElement.textContent = `총 ${total}개의 숙소`;
        }
    }

    /**
     * 가격 포맷팅
     */
    formatPrice(price) {
        return new Intl.NumberFormat('ko-KR').format(price);
    }

    /**
     * 로딩 표시/숨김
     */
    showLoading(show) {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const accommodationGrid = document.getElementById('accommodationGrid');

        if (show) {
            loadingSpinner.style.display = 'block';
            accommodationGrid.style.opacity = '0.5';
        } else {
            loadingSpinner.style.display = 'none';
            accommodationGrid.style.opacity = '1';
        }
    }
}

// 숙소 상세 페이지로 이동
function goToDetail(accommodationId) {
    window.location.href = `/accommodation/detail/${accommodationId}`;
}

// 기존 JSP 호환을 위한 전역 함수들
function goToPage(pageNum) {
    if (window.accommodationController) {
        window.accommodationController.goToPage(pageNum);
    }
}

function closeModal(modalId) {
    if (window.accommodationController) {
        window.accommodationController.closeModal(modalId);
    }
}

function showCalendar() {
    if (window.accommodationController) {
        window.accommodationController.showCalendar();
    }
}

function prevMonth() {
    if (window.accommodationController) {
        window.accommodationController.prevMonth();
    }
}

function nextMonth() {
    if (window.accommodationController) {
        window.accommodationController.nextMonth();
    }
}

function increaseCount(type) {
    if (window.accommodationController) {
        window.accommodationController.increaseCount(type);
    }
}

function decreaseCount(type) {
    if (window.accommodationController) {
        window.accommodationController.decreaseCount(type);
    }
}

function applyDatePerson() {
    if (window.accommodationController) {
        window.accommodationController.applyDatePerson();
    }
}

function applyFilter() {
    if (window.accommodationController) {
        window.accommodationController.applyFilter();
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.accommodationController = new AccommodationSearchController();
});