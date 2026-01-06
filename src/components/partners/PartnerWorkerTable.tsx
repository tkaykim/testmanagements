'use client';

import React from 'react';
import { Tables } from '@/types/database';

type PartnerWorker = Tables<'partner_worker'>;

interface PartnerWorkerTableProps {
  workers: PartnerWorker[];
  onEdit: (worker: PartnerWorker) => void;
  onDelete: (id: number) => void;
}

export const PartnerWorkerTable: React.FC<PartnerWorkerTableProps> = ({
  workers,
  onEdit,
  onDelete,
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
      {/* 모바일 카드 뷰 */}
      <div className="md:hidden space-y-4">
        {workers.map((worker) => (
          <div key={worker.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {worker.name || worker.name_ko || worker.name_en || '-'}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(worker)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(worker.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">이메일:</span>
                <span className="text-gray-900 break-all text-right">{worker.email || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">전화번호:</span>
                <span className="text-gray-900">{worker.phone || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">워커 타입:</span>
                <span className="text-gray-900">{worker.worker_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">활성 상태:</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    worker.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {worker.is_active ? '활성' : '비활성'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workers.map((worker) => (
              <tr key={worker.id} className="hover:bg-gray-50">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(worker)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(worker.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

