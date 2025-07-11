/**
 * 통합 슬라이더 관리자
 * 모든 페이지에서 재사용 가능한 슬라이더 기능
 */
class SliderManager {
    constructor() {
        this.sliders = new Map();
        this.config = {
            event: { itemWidth: 316, visibleItems: 3 },
            hot: { itemWidth: 296, visibleItems: 4 },
            popular: { itemWidth: 296, visibleItems: 4 },
            default: { itemWidth: 280, visibleItems: 4 }
        };
    }

    /**
     * 모든 슬라이더 초기화
     */
    static initializeAllSliders() {
        const manager = new SliderManager();
        const sliderContainers = document.querySelectorAll('.slider-container');

        sliderContainers.forEach(container => {
            const type = container.dataset.sliderType || 'default';
            manager.initializeSlider(container, type);
        });

        // 전역에서 접근 가능하도록 설정
        window.sliderManager = manager;
    }

    /**
     * 개별 슬라이더 초기화
     */
    initializeSlider(container, type = 'default') {
        const track = container.querySelector('.slider-track');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const items = track.querySelectorAll('.slider-item');

        if (!track || items.length === 0) return;

        const config = this.config[type] || this.config.default;
        const sliderData = {
            container,
            track,
            prevBtn,
            nextBtn,
            items,
            currentIndex: 0,
            maxIndex: 0,
            itemWidth: config.itemWidth,
            visibleItems: config.visibleItems,
            type
        };

        // 반응형 설정 계산
        this.calculateResponsiveSettings(sliderData);

        // 이벤트 리스너 추가
        this.addEventListeners(sliderData);

        // 버튼 상태 업데이트
        this.updateButtonState(sliderData);

        // 슬라이더 맵에 저장
        const sliderId = type + '_' + Date.now();
        this.sliders.set(sliderId, sliderData);

        // 윈도우 리사이즈 이벤트
        window.addEventListener('resize', () => {
            this.handleResize(sliderData);
        });
    }

    /**
     * 반응형 설정 계산
     */
    calculateResponsiveSettings(sliderData) {
        const containerWidth = sliderData.container.offsetWidth - 120; // 버튼 공간 제외
        const gap = 16; // CSS gap과 일치

        // 실제 아이템 너비 (gap 포함)
        const actualItemWidth = sliderData.itemWidth + gap;

        // 화면에 보일 아이템 수 계산
        const calculatedVisibleItems = Math.floor(containerWidth / actualItemWidth);
        sliderData.actualVisibleItems = Math.max(1, Math.min(calculatedVisibleItems, sliderData.visibleItems));

        // 최대 인덱스 계산
        sliderData.maxIndex = Math.max(0, sliderData.items.length - sliderData.actualVisibleItems);

        // 현재 인덱스가 범위를 벗어나지 않도록 조정
        sliderData.currentIndex = Math.min(sliderData.currentIndex, sliderData.maxIndex);
    }

    /**
     * 이벤트 리스너 추가
     */
    addEventListeners(sliderData) {
        if (sliderData.prevBtn) {
            sliderData.prevBtn.addEventListener('click', () => {
                this.slideTo(sliderData, sliderData.currentIndex - 1);
            });
        }

        if (sliderData.nextBtn) {
            sliderData.nextBtn.addEventListener('click', () => {
                this.slideTo(sliderData, sliderData.currentIndex + 1);
            });
        }

        // 터치 스와이프 지원
        this.addTouchSupport(sliderData);
    }

    /**
     * 터치 스와이프 지원
     */
    addTouchSupport(sliderData) {
        let startX = 0;
        let isTouch = false;

        sliderData.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isTouch = true;
        });

        sliderData.track.addEventListener('touchend', (e) => {
            if (!isTouch) return;

            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) { // 최소 스와이프 거리
                if (diffX > 0) {
                    // 왼쪽으로 스와이프 (다음)
                    this.slideTo(sliderData, sliderData.currentIndex + 1);
                } else {
                    // 오른쪽으로 스와이프 (이전)
                    this.slideTo(sliderData, sliderData.currentIndex - 1);
                }
            }

            isTouch = false;
        });
    }

    /**
     * 특정 인덱스로 슬라이드
     */
    slideTo(sliderData, index) {
        const newIndex = Math.max(0, Math.min(index, sliderData.maxIndex));

        if (newIndex === sliderData.currentIndex) return;

        sliderData.currentIndex = newIndex;

        // 트랜스폼 적용
        const translateX = -(sliderData.currentIndex * (sliderData.itemWidth + 16));
        sliderData.track.style.transform = `translateX(${translateX}px)`;

        // 버튼 상태 업데이트
        this.updateButtonState(sliderData);

        // 커스텀 이벤트 발생
        this.dispatchSlideEvent(sliderData);
    }

    /**
     * 버튼 상태 업데이트
     */
    updateButtonState(sliderData) {
        if (sliderData.prevBtn) {
            sliderData.prevBtn.classList.toggle('disabled', sliderData.currentIndex === 0);
        }

        if (sliderData.nextBtn) {
            sliderData.nextBtn.classList.toggle('disabled', sliderData.currentIndex >= sliderData.maxIndex);
        }
    }

    /**
     * 윈도우 리사이즈 처리
     */
    handleResize(sliderData) {
        // 디바운싱을 위한 타이머
        clearTimeout(sliderData.resizeTimer);
        sliderData.resizeTimer = setTimeout(() => {
            this.calculateResponsiveSettings(sliderData);
            this.slideTo(sliderData, sliderData.currentIndex); // 현재 위치 재계산
        }, 250);
    }

    /**
     * 커스텀 이벤트 발생
     */
    dispatchSlideEvent(sliderData) {
        const event = new CustomEvent('sliderChange', {
            detail: {
                type: sliderData.type,
                currentIndex: sliderData.currentIndex,
                maxIndex: sliderData.maxIndex,
                visibleItems: sliderData.actualVisibleItems
            }
        });
        sliderData.container.dispatchEvent(event);
    }

    /**
     * 특정 슬라이더 제어 (외부에서 호출 가능)
     */
    static getSlider(type) {
        if (window.sliderManager) {
            for (let [id, slider] of window.sliderManager.sliders) {
                if (slider.type === type) {
                    return slider;
                }
            }
        }
        return null;
    }

    /**
     * 슬라이더 리셋
     */
    static resetSlider(type) {
        const slider = SliderManager.getSlider(type);
        if (slider && window.sliderManager) {
            window.sliderManager.slideTo(slider, 0);
        }
    }

    /**
     * 모든 슬라이더 새로고침
     */
    static refreshAllSliders() {
        if (window.sliderManager) {
            window.sliderManager.sliders.forEach(slider => {
                window.sliderManager.calculateResponsiveSettings(slider);
                window.sliderManager.slideTo(slider, slider.currentIndex);
            });
        }
    }
}

// DOM 로드 시 자동 초기화 (선택사항)
document.addEventListener('DOMContentLoaded', () => {
    // 자동 초기화를 원하지 않으면 이 부분을 제거하고 수동으로 호출
    // SliderManager.initializeAllSliders();
});

// 모듈 패턴으로 내보내기
window.SliderManager = SliderManager;