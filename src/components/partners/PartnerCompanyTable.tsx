'use client';

import React from 'react';
import { Tables } from '@/types/database';

type PartnerCompany = Tables<'partner_company'>;

interface PartnerCompanyTableProps {
  companies: PartnerCompany[];
  onSelect: (company: PartnerCompany) => void;
}

export const PartnerCompanyTable: React.FC<PartnerCompanyTableProps> = ({
  companies,
  onSelect,
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
      {/* 모바일 리스트 뷰 */}
      <div className="md:hidden bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {companies.map((company) => (
          <button
            key={company.id}
            type="button"
            onClick={() => onSelect(company)}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 active:bg-gray-100"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">{company.company_name_ko || '-'}</div>
                <div className="text-xs text-gray-500 truncate">
                  {(company.industry || '업종 -') + ' · ' + (company.partner_type || '-')}
                </div>
              </div>
              <span
                className={`shrink-0 px-2 py-1 text-xs rounded-full ${
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
          </button>
        ))}
      </div>

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회사명 (한글)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">업종</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                파트너 타입
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-gray-50 cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => onSelect(company)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelect(company);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {company.company_name_ko || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.industry || '-'}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

