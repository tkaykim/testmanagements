'use client';

import React from 'react';
import { Tables } from '@/types/database';

type Dancer = Tables<'dancers'>;

interface DancerTableProps {
  dancers: Dancer[];
  onEdit: (dancer: Dancer) => void;
  onDelete: (id: number) => void;
}

export const DancerTable: React.FC<DancerTableProps> = ({ dancers, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              닉네임
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              팀명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              연락처
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              국적
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              성별
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              계약 기간
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              비자
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dancers.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            dancers.map((dancer) => (
              <tr key={dancer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {(() => {
                    const nicknameKo = dancer.nickname_ko || '';
                    const nicknameEn = dancer.nickname_en || '';
                    if (nicknameKo && nicknameEn) {
                      return `${nicknameKo} (${nicknameEn})`;
                    } else if (nicknameKo) {
                      return nicknameKo;
                    } else if (nicknameEn) {
                      return nicknameEn;
                    }
                    return '-';
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(() => {
                    const team = (dancer as any).dance_team;
                    if (team) {
                      const nameKo = team.name_ko || '';
                      const nameEn = team.name_en || '';
                      if (nameKo && nameEn) {
                        return `${nameKo} (${nameEn})`;
                      } else if (nameKo) {
                        return nameKo;
                      } else if (nameEn) {
                        return nameEn;
                      }
                    }
                    return '-';
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dancer.contact || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dancer.nationality || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dancer.gender === 'male' ? '남' : dancer.gender === 'female' ? '여' : dancer.gender || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(() => {
                    const contractStart = (dancer as any).contract_start;
                    const contractEnd = (dancer as any).contract_end;
                    if (contractStart && contractEnd) {
                      const start = new Date(contractStart).toLocaleDateString('ko-KR');
                      const end = new Date(contractEnd).toLocaleDateString('ko-KR');
                      return `${start} ~ ${end}`;
                    } else if (contractStart) {
                      return `${new Date(contractStart).toLocaleDateString('ko-KR')} ~`;
                    } else if (contractEnd) {
                      return `~ ${new Date(contractEnd).toLocaleDateString('ko-KR')}`;
                    }
                    return '-';
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(() => {
                    const visaType = (dancer as any).visa_type;
                    const visaStart = (dancer as any).visa_start;
                    const visaEnd = (dancer as any).visa_end;
                    if (visaType || visaStart || visaEnd) {
                      const parts = [];
                      if (visaType) parts.push(visaType);
                      if (visaStart && visaEnd) {
                        const start = new Date(visaStart).toLocaleDateString('ko-KR');
                        const end = new Date(visaEnd).toLocaleDateString('ko-KR');
                        parts.push(`${start} ~ ${end}`);
                      } else if (visaStart) {
                        parts.push(`${new Date(visaStart).toLocaleDateString('ko-KR')} ~`);
                      } else if (visaEnd) {
                        parts.push(`~ ${new Date(visaEnd).toLocaleDateString('ko-KR')}`);
                      }
                      return parts.join(' / ');
                    }
                    return '-';
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(dancer)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(dancer.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

