'use client';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* 햄버거 버튼 - 모바일에서만 표시 */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="메뉴 열기"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Total Management ERP</h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <span className="text-sm md:text-base text-gray-600 hidden sm:inline">관리자</span>
          <button className="text-sm md:text-base text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100">
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

