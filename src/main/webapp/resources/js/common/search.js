/**
 * 헤더 검색 기능
 * 검색창에서 텍스트만 전송
 */
class SearchManager {
    constructor(contextPath = '') {
        this.contextPath = contextPath;
    }

    /**
     * 검색 매니저 초기화
     */
    static initialize(contextPath = '') {
        const manager = new SearchManager(contextPath);
        manager.bindEvents();

        window.searchManager = manager;
        return manager;
    }

    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        const searchInput = document.querySelector('#searchInput');

        if (searchInput) {
            // 엔터키로 검색
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }
    }

    /**
     * 검색 처리
     */
    handleSearch() {
        const searchInput = document.querySelector('#searchInput');
        const keyword = searchInput ? searchInput.value.trim() : '';

        if (!keyword) {
            alert('검색어를 입력해주세요.');
            return;
        }

        // 검색 결과 페이지로 이동
        const searchUrl = `${this.contextPath}/search?keyword=${encodeURIComponent(keyword)}`;
        window.location.href = searchUrl;
    }
}

window.SearchManager = SearchManager;