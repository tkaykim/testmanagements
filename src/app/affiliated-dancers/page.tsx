'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DancerTable } from '@/components/dancers/DancerTable';
import { DancerModal } from '@/components/dancers/DancerModal';
import { DanceTeamTable } from '@/components/dance-teams/DanceTeamTable';
import { DanceTeamModal } from '@/components/dance-teams/DanceTeamModal';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database';

type Dancer = Tables<'dancers'>;

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

// '그리고 엔터테인먼트' 회사 ID
const GRIGO_ENTERTAINMENT_COMPANY_ID = 9;

export default function AffiliatedDancersPage() {
  const [activeTab, setActiveTab] = useState<'dancers' | 'teams'>('dancers');
  const [dancers, setDancers] = useState<Dancer[]>([]);
  const [filteredDancers, setFilteredDancers] = useState<Dancer[]>([]);
  const [teams, setTeams] = useState<DanceTeam[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDancerModalOpen, setIsDancerModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedDancer, setSelectedDancer] = useState<Dancer | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<DanceTeam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'dancers') {
      fetchAffiliatedDancers();
    } else {
      fetchAffiliatedTeams();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDancers(dancers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = dancers.filter((dancer) => {
        const contact = (dancer.contact || '').toLowerCase();
        const nationality = (dancer.nationality || '').toLowerCase();
        const gender = (dancer.gender || '').toLowerCase();
        const nicknameKo = (dancer.nickname_ko || '').toLowerCase();
        const nicknameEn = (dancer.nickname_en || '').toLowerCase();
        const realName = (dancer.real_name || '').toLowerCase();
        
        return (
          contact.includes(query) ||
          nationality.includes(query) ||
          gender.includes(query) ||
          nicknameKo.includes(query) ||
          nicknameEn.includes(query) ||
          realName.includes(query)
        );
      });
      setFilteredDancers(filtered);
    }
  }, [searchQuery, dancers]);

  const fetchAffiliatedDancers = async () => {
    try {
      setLoading(true);
      // Supabase MCP를 통해 '그리고 엔터테인먼트' 소속 댄서만 조회
      const response = await fetch(`/api/dancers?company_id=${GRIGO_ENTERTAINMENT_COMPANY_ID}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '데이터를 불러오는데 실패했습니다.');
      }
      
      setDancers(result.data || []);
    } catch (error) {
      console.error('소속 댄서 목록 조회 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAffiliatedTeams = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('dance_team')
        .select('*')
        .eq('partner_company_id', GRIGO_ENTERTAINMENT_COMPANY_ID)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('소속 댄스팀 목록 조회 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDancer = () => {
    setSelectedDancer(null);
    setIsDancerModalOpen(true);
  };

  const handleAddTeam = () => {
    setSelectedTeam(null);
    setIsTeamModalOpen(true);
  };

  const handleEditDancer = (dancer: Dancer) => {
    setSelectedDancer(dancer);
    setIsDancerModalOpen(true);
  };

  const handleEditTeam = (team: DanceTeam) => {
    setSelectedTeam(team);
    setIsTeamModalOpen(true);
  };

  const handleDeleteDancer = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/dancers?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '삭제에 실패했습니다.');
      }
      
      await fetchAffiliatedDancers();
    } catch (error) {
      console.error('댄서 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      // 먼저 매핑 테이블에서 관련 데이터 삭제
      const { error: mappingError } = await (supabase as any)
        .from('dancer_team_mapping')
        .delete()
        .eq('dance_team_id', id);

      if (mappingError) throw mappingError;

      // 그 다음 댄스팀 삭제
      const { error } = await (supabase as any).from('dance_team').delete().eq('id', id);
      if (error) throw error;

      await fetchAffiliatedTeams();
    } catch (error) {
      console.error('댄스팀 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSave = async (dancerData: Partial<Dancer> & { dance_team_id?: number | null }) => {
    try {
      // 빈 문자열을 null로 변환하는 헬퍼 함수
      const cleanData = (data: Partial<Dancer>): any => {
        const cleaned: any = {};
        // DB에 없는 필드들 제외
        const excludedFields = ['dance_team', 'dance_team_id', 'team_name'];
        // 날짜 필드 목록
        const dateFields = ['contract_start', 'contract_end', 'visa_start', 'visa_end'];
        
        Object.keys(data).forEach((key) => {
          // 제외할 필드는 건너뛰기
          if (excludedFields.includes(key)) {
            return;
          }
          
          const field = key as keyof Dancer;
          const value = data[field];
          
          // gender 필드는 특별 처리: 빈 문자열이면 null
          if (field === 'gender') {
            cleaned[field] = value === '' || value === null ? null : value;
          }
          // 날짜 필드 처리 (contract_start, contract_end, visa_start, visa_end)
          else if (dateFields.includes(key)) {
            cleaned[key] = (value === '' || value === null || value === undefined) ? null : value;
          }
          // 문자열 필드인 경우 빈 문자열을 null로 변환
          else if (typeof value === 'string') {
            cleaned[field] = value.trim() || null;
          } else {
            cleaned[field] = value;
          }
        });
        return cleaned;
      };

      // dance_team_id를 별도로 추출
      const danceTeamId = (dancerData as any).dance_team_id;
      
      let savedDancerId: number;
      
      if (selectedDancer) {
        const cleanedData = cleanData(dancerData);
        const response = await fetch('/api/dancers', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedDancer.id,
            ...cleanedData,
            updated_at: new Date().toISOString(),
          }),
        });
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || '저장에 실패했습니다.');
        }
        savedDancerId = selectedDancer.id;
      } else {
        // nickname_ko, nickname_en, real_name 중 하나는 필수
        if (!dancerData.nickname_ko?.trim() && !dancerData.nickname_en?.trim() && !dancerData.real_name?.trim()) {
          alert('한국어 닉네임, 영어 닉네임, 실명 중 하나는 필수로 입력해야 합니다.');
          return;
        }
        
        const cleanedData = cleanData(dancerData);
        const response = await fetch('/api/dancers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...cleanedData,
            partner_company_id: GRIGO_ENTERTAINMENT_COMPANY_ID, // 소속 댄서는 항상 '그리고 엔터테인먼트'로 설정
            bu_code: 'GRIGO',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || '저장에 실패했습니다.');
        }
        savedDancerId = result.data?.id;
      }
      
      // 댄서-팀 매핑 처리
      if (savedDancerId) {
        // 기존 매핑 삭제
        const { error: deleteError } = await (supabase as any)
          .from('dancer_team_mapping')
          .delete()
          .eq('dancer_id', savedDancerId);
        if (deleteError) console.error('기존 댄서-팀 매핑 삭제 실패:', deleteError);

          // 새로운 매핑 추가
          if (danceTeamId) {
            const { error: insertError } = await (supabase as any)
              .from('dancer_team_mapping')
            .insert({ dancer_id: savedDancerId, dance_team_id: danceTeamId });
          if (insertError) throw insertError;
        }
      }
      
      setIsDancerModalOpen(false);
      setSelectedDancer(null);
      await fetchAffiliatedDancers();
    } catch (error) {
      console.error('댄서 저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleSaveTeam = async (teamData: Partial<DanceTeam>) => {
    try {
      // 빈 문자열을 null로 변환
      const cleanedData: any = { ...teamData };
      Object.keys(cleanedData).forEach((key) => {
        if (typeof cleanedData[key] === 'string' && cleanedData[key].trim() === '') {
          cleanedData[key] = null;
        }
      });

      if (selectedTeam) {
        const { error } = await (supabase as any)
          .from('dance_team')
          .update({ ...cleanedData, updated_at: new Date().toISOString() })
          .eq('id', selectedTeam.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from('dance_team').insert({
          ...cleanedData,
          partner_company_id: GRIGO_ENTERTAINMENT_COMPANY_ID, // 소속 댄스팀은 항상 '그리고 엔터테인먼트'로 설정
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
      setIsTeamModalOpen(false);
      setSelectedTeam(null);
      await fetchAffiliatedTeams();
    } catch (error) {
      console.error('댄스팀 저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">소속 댄서 관리</h1>
          <button
            onClick={activeTab === 'dancers' ? handleAddDancer : handleAddTeam}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {activeTab === 'dancers' ? '댄서 추가' : '댄스팀 추가'}
          </button>
        </div>

        <p className="text-sm text-gray-600">
          &apos;그리고 엔터테인먼트&apos; 소속 댄서 및 댄스팀을 관리합니다.
        </p>

        {/* 탭 메뉴 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dancers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dancers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              댄서 ({dancers.length})
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'teams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              댄스팀 ({teams.length})
            </button>
          </nav>
        </div>

        {/* 댄서 탭 */}
        {activeTab === 'dancers' && (
          <>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="닉네임, 실명, 연락처, 국적, 성별 등으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-2 text-sm text-gray-600">
                  검색 결과: {filteredDancers.length}명
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">로딩 중...</div>
            ) : (
              <DancerTable dancers={filteredDancers} onEdit={handleEditDancer} onDelete={handleDeleteDancer} />
            )}
          </>
        )}

        {/* 댄스팀 탭 */}
        {activeTab === 'teams' && (
          <>
            {loading ? (
              <div className="text-center py-8">로딩 중...</div>
            ) : (
              <DanceTeamTable teams={teams} onEdit={handleEditTeam} onDelete={handleDeleteTeam} />
            )}
          </>
        )}

        {/* 댄서 모달 */}
        <DancerModal
          isOpen={isDancerModalOpen}
          onClose={() => {
            setIsDancerModalOpen(false);
            setSelectedDancer(null);
          }}
          onSave={handleSave}
          dancer={selectedDancer || ({ partner_company_id: GRIGO_ENTERTAINMENT_COMPANY_ID } as any)}
        />

        {/* 댄스팀 모달 */}
        <DanceTeamModal
          isOpen={isTeamModalOpen}
          onClose={() => {
            setIsTeamModalOpen(false);
            setSelectedTeam(null);
          }}
          onSave={handleSaveTeam}
          team={selectedTeam}
        />
      </div>
    </DashboardLayout>
  );
}

