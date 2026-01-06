'use client';

import React from 'react';

interface DanceTeam {
  id: number;
  name_ko: string | null;
  name_en: string | null;
  nationality: string | null;
  logo: string | null;
  photo: string | null;
  leader_id: number | null;
  partner_company_id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface DanceTeamTableProps {
  teams: DanceTeam[];
  onEdit: (team: DanceTeam) => void;
  onDelete: (id: number) => void;
}

export const DanceTeamTable: React.FC<DanceTeamTableProps> = ({ teams, onEdit, onDelete }) => {
  if (teams.length === 0) {
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
        {teams.map((team) => (
          <div key={team.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{team.name_ko || '-'}</h3>
                {team.name_en && (
                  <p className="text-sm text-gray-500 mt-1">{team.name_en}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(team)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(team.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">국적:</span>
                <span className="text-gray-900">{team.nationality || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">파트너 회사 ID:</span>
                <span className="text-gray-900">{team.partner_company_id || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">생성일:</span>
                <span className="text-gray-900">
                  {team.created_at ? new Date(team.created_at).toLocaleDateString('ko-KR') : '-'}
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
                팀명 (한글)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                팀명 (영문)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                국적
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                파트너 회사 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                생성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {team.name_ko}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {team.name_en || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {team.nationality || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {team.partner_company_id || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {team.created_at ? new Date(team.created_at).toLocaleDateString('ko-KR') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(team)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(team.id)}
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

