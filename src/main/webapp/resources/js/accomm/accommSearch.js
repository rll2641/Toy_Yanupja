/**
 * 숙소 검색 컨트롤 관리자
 */
class AccommodationSearchController {
    constructor() {
        this.currentDate = new Date();
        this.selectedStartDate = null;
        this.selectedEndDate = null;
        this.adultCount = 2;
        this.childCount = 0;
        this.currentSort = 'rating';
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
    }

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

        // 월/년 업데이트
        document.querySelector('.month-year').textContent = `${year}.${String(month + 1).padStart(2, '0')}`;

        // 첫 번째 날과 마지막 날
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

            // 오늘 날짜 이전은 비활성화
            const currentDateObj = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (currentDateObj < today) {
                dateElement.classList.add('disabled');
                dateElement.style.pointerEvents = 'none';
            }

            // 선택된 날짜 표시
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
            // 새로운 시작 날짜 선택
            this.selectedStartDate = date;
            this.selectedEndDate = null;
        } else {
            // 종료 날짜 선택
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
     * 날짜 표시 업데이트
     */
    updateDateDisplay() {
        if (this.selectedStartDate && this.selectedEndDate) {
            const start = this.formatDate(this.selectedStartDate);
            const end = this.formatDate(this.selectedEndDate);
            const nights = Math.ceil((this.selectedEndDate - this.selectedStartDate) / (1000 * 60 * 60 * 24));

            document.querySelector('.date-text').textContent = `${start}~${end} · ${nights}박`;
        }
    }

    /**
     * 날짜 포맷팅
     */
    formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = days[date.getDay()];

        return `${month}.${day}(${dayName})`;
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
        const total = this.adultCount + this.childCount;
        document.querySelector('.person-header span:last-child').textContent = `성인 ${this.adultCount}${this.childCount > 0 ? ', 아동 ' + this.childCount : ''}`;
    }

    /**
     * 필터 옵션 처리
     */
    handleFilterOption(option) {
        const parent = option.parentElement;
        const isMultiSelect = parent.classList.contains('filter-options') &&
            (option.dataset.rating || option.dataset.accommodation);

        if (isMultiSelect) {
            // 다중 선택 (호텔 성급, 숙소 유형)
            option.classList.toggle('active');
        } else {
            // 단일 선택 (예약 유형)
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
        // 기존 선택 해제
        document.querySelectorAll('.sort-option').forEach(opt => {
            opt.classList.remove('active');
            opt.querySelector('.check-icon')?.remove();
        });

        // 새로운 선택 활성화
        option.classList.add('active');
        const checkIcon = document.createElement('span');
        checkIcon.className = 'check-icon';
        checkIcon.textContent = '✓';
        option.appendChild(checkIcon);

        // 정렬 값 저장
        this.currentSort = option.dataset.sort;

        // 정렬 버튼 텍스트 업데이트
        const sortText = option.querySelector('span:first-child').textContent;
        document.getElementById('sortText').textContent = sortText;
    }

    /**
     * 날짜/인원 적용
     */
    applyDatePerson() {
        // 버튼 텍스트 업데이트
        if (this.selectedStartDate && this.selectedEndDate) {
            const start = this.formatDateShort(this.selectedStartDate);
            const end = this.formatDateShort(this.selectedEndDate);
            const total = this.adultCount + this.childCount;

            document.getElementById('datePersonText').textContent = `${start}-${end} · ${total}명`;
        }

        this.closeModal('datePersonModal');

        // 실제 검색 로직 호출
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

        this.closeModal('filterModal');

        // 실제 검색 로직 호출
        this.performSearch();
    }

    /**
     * 짧은 날짜 포맷
     */
    formatDateShort(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}.${day}`;
    }

    /**
     * 검색 실행
     */
    performSearch() {
        // 검색 파라미터 구성
        const searchParams = {
            startDate: this.selectedStartDate ? this.selectedStartDate.toISOString().split('T')[0] : null,
            endDate: this.selectedEndDate ? this.selectedEndDate.toISOString().split('T')[0] : null,
            adultCount: this.adultCount,
            childCount: this.childCount,
            minPrice: this.filters.minPrice,
            maxPrice: this.filters.maxPrice,
            bookingType: this.filters.bookingType,
            rating: this.filters.rating.join(','),
            accommodationType: this.filters.accommodationType.join(','),
            sort: this.currentSort
        };

        console.log('검색 파라미터:', searchParams);

        // 여기에 실제 서버 요청 로직 구현
        // this.sendSearchRequest(searchParams);
    }

    /**
     * 서버에 검색 요청 (예시)
     */
    sendSearchRequest(params) {
        // jQuery 사용 예시
        /*
        $.ajax({
            url: '/accommodation/search',
            method: 'GET',
            data: params,
            success: function(response) {
                // 검색 결과 표시
                this.displaySearchResults(response);
            }.bind(this),
            error: function(xhr, status, error) {
                console.error('검색 실패:', error);
                alert('검색 중 오류가 발생했습니다.');
            }
        });
        */

        // Fetch API 사용 예시
        /*
        const queryString = new URLSearchParams(params).toString();
        fetch(`/accommodation/search?${queryString}`)
            .then(response => response.json())
            .then(data => {
                this.displaySearchResults(data);
            })
            .catch(error => {
                console.error('검색 실패:', error);
                alert('검색 중 오류가 발생했습니다.');
            });
        */
    }

    /**
     * 검색 결과 표시 (예시)
     */
    displaySearchResults(results) {
        // 결과를 페이지에 표시하는 로직
        console.log('검색 결과:', results);
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
    // 숙소 상세 페이지로 이동
    window.location.href = `/accommodation/detail/${accommodationId}`;
}

// 페이지 이동
function goToPage(pageNum) {
    // 현재 URL의 쿼리 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);

    // 페이지 번호 업데이트
    urlParams.set('pageIdx', pageNum);

    // 새로운 URL로 이동
    window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
}

// 전역 함수들 (JSP에서 직접 호출)
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