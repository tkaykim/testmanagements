'use client';

import React from 'react';
import { Tables } from '@/types/database';

type PartnerCompany = Tables<'partner_company'>;

interface PartnerCompanyTableProps {
  companies: PartnerCompany[];
  onEdit: (company: PartnerCompany) => void;
  onDelete: (id: number) => void;
}

export const PartnerCompanyTable: React.FC<PartnerCompanyTableProps> = ({
  companies,
  onEdit,
  onDelete,
}) => {
  if (companies.length === 0) {
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
        {companies.map((company) => (
          <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{company.company_name_ko || '-'}</h3>
                {company.company_name_en && (
                  <p className="text-sm text-gray-500 mt-1">{company.company_name_en}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(company)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(company.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">파트너 타입:</span>
                <span className="text-gray-900">{company.partner_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">상태:</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    company.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : company.status === 'inactive'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {company.status}
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
                회사명 (한글)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회사명 (영문)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                파트너 타입
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {company.company_name_ko || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.company_name_en || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.partner_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      company.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : company.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(company)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(company.id)}
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

