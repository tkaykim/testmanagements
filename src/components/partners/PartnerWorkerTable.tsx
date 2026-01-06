'use client';

import React from 'react';
import { Tables } from '@/types/database';

type PartnerWorker = Tables<'partner_worker'>;

interface PartnerWorkerTableProps {
  workers: PartnerWorker[];
  onSelect: (worker: PartnerWorker) => void;
}

export const PartnerWorkerTable: React.FC<PartnerWorkerTableProps> = ({
  workers,
  onSelect,
}) => {
  if (workers.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
        데이터가 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* 모바일 리스트 뷰 */}
      <div className="md:hidden bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {workers.map((worker) => (
          <button
            key={worker.id}
            type="button"
            onClick={() => onSelect(worker)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 active:bg-gray-100"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {worker.name || worker.name_ko || worker.name_en || '-'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {(worker.worker_type || '-') + ' · ' + (worker.email || '이메일 -')}
                </div>
              </div>
              <span
                className={`shrink-0 px-2 py-1 text-xs rounded-full ${
                  worker.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {worker.is_active ? '활성' : '비활성'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                전화번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                워커 타입
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                활성 상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workers.map((worker) => (
              <tr
                key={worker.id}
                className="hover:bg-gray-50 cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => onSelect(worker)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelect(worker);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {worker.name || worker.name_ko || worker.name_en || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {worker.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {worker.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {worker.worker_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      worker.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {worker.is_active ? '활성' : '비활성'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

