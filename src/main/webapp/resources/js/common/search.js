/**
 * 🔧 수정된 헤더 검색 기능
 */
class SearchManager {
    constructor(contextPath = '') {
        this.contextPath = contextPath;
        console.log('🔍 SearchManager 초기화됨. ContextPath:', contextPath);
    }

    static initialize(contextPath = '') {
        const manager = new SearchManager(contextPath);
        manager.bindEvents();

        window.searchManager = manager;
        console.log('✅ SearchManager 전역 등록 완료');
        return manager;
    }

    bindEvents() {
        const searchInput = document.querySelector('#searchInput');

        if (searchInput) {
            console.log('🎯 검색 입력창 찾음:', searchInput);

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('⌨️ 엔터키 눌림');
                    this.handleSearch();
                }
            });

            searchInput.addEventListener('focus', () => {
                console.log('🎯 검색창에 포커스됨');
            });
        } else {
            console.error('❌ 검색 입력창을 찾을 수 없습니다');
        }
    }

    handleSearch() {
        console.log('🔍 검색 처리 시작');

        const searchInput = document.querySelector('#searchInput');
        const keyword = searchInput ? searchInput.value.trim() : '';

        console.log('📝 검색어:', keyword);

        if (!keyword) {
            alert('검색어를 입력해주세요.');
            return;
        }

        // 🔧 수정: 현재 페이지가 검색 페이지인지 확인
        const currentPath = window.location.pathname;
        const isSearchPage = currentPath.includes('/domestic/search');

        if (isSearchPage && window.accommodationController) {
            // 🔧 이미 검색 페이지에 있으면 검색 조건만 업데이트
            console.log('🔄 검색 페이지에서 새 검색어 적용');
            window.accommodationController.setSearchKeyword(keyword);
        } else {
            // 🔧 다른 페이지에서는 검색 페이지로 이동
            const searchUrl = `${this.contextPath}/domestic/search?keyword=${encodeURIComponent(keyword)}`;
            console.log('🌐 검색 페이지로 이동:', searchUrl);
            window.location.href = searchUrl;
        }
    }
}

// 전역으로 내보내기
window.SearchManager = SearchManager;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM 로드 완료 - SearchManager 초기화 시작');

    const contextPath = window.location.pathname.split('/')[1] || '';
    const fullContextPath = contextPath ? `/${contextPath}` : '';

    console.log('🌐 감지된 컨텍스트 경로:', fullContextPath);

    SearchManager.initialize(fullContextPath);
});