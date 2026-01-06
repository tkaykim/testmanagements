'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 모바일 오버레이 */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeDrawer}
        />
      )}
      
      {/* 사이드바/드로어 */}
      <Sidebar isOpen={isDrawerOpen} onClose={closeDrawer} />
      
      <div className="flex-1 flex flex-col w-full lg:ml-0">
        <Header onMenuClick={toggleDrawer} />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

