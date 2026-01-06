'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  name: string;
  href: string;
  icon?: string;
}

const menuItems: MenuItem[] = [
  { name: '소속 댄서 관리', href: '/affiliated-dancers' },
  { name: '댄스팀 관리', href: '/dance-teams' },
  { name: '댄서 관리', href: '/dancers' },
  { name: '파트너 관리', href: '/partners' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      {/* 사이드바/드로어 */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 md:p-6 flex justify-between items-center lg:block">
          <h2 className="text-xl md:text-2xl font-bold">ERP 시스템</h2>
          {/* 모바일 닫기 버튼 */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none"
            aria-label="메뉴 닫기"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="mt-4 md:mt-8">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

