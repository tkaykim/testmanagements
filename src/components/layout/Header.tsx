'use client';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Total Management ERP</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">관리자</span>
          <button className="text-gray-600 hover:text-gray-900">로그아웃</button>
        </div>
      </div>
    </header>
  );
};

