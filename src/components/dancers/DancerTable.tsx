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
  const getNickname = (dancer: Dancer) => {
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
  };

  const getTeamName = (dancer: Dancer) => {
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
  };

  const getContractPeriod = (dancer: Dancer) => {
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
  };

  const getVisaInfo = (dancer: Dancer) => {
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
  };

  if (dancers.length === 0) {
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
        {dancers.map((dancer) => (
          <div key={dancer.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{getNickname(dancer)}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(dancer)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(dancer.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">팀명:</span>
                <span className="text-gray-900">{getTeamName(dancer)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">연락처:</span>
                <span className="text-gray-900">{dancer.contact || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">국적:</span>
                <span className="text-gray-900">{dancer.nationality || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">성별:</span>
                <span className="text-gray-900">
                  {dancer.gender === 'male' ? '남' : dancer.gender === 'female' ? '여' : dancer.gender || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">계약 기간:</span>
                <span className="text-gray-900">{getContractPeriod(dancer)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">비자:</span>
                <span className="text-gray-900">{getVisaInfo(dancer)}</span>
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
            {dancers.map((dancer) => (
              <tr key={dancer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getNickname(dancer)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getTeamName(dancer)}
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
                  {getContractPeriod(dancer)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getVisaInfo(dancer)}
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
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

