'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DancerTable } from '@/components/dancers/DancerTable';
import { DancerModal } from '@/components/dancers/DancerModal';
import { Tables } from '@/types/database';

type Dancer = Tables<'dancers'>;

export default function DancersPage() {
  const [dancers, setDancers] = useState<Dancer[]>([]);
  const [filteredDancers, setFilteredDancers] = useState<Dancer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDancer, setSelectedDancer] = useState<Dancer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDancers();
  }, []);

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

  const fetchDancers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dancers');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '데이터를 불러오는데 실패했습니다.');
      }
      
      setDancers(result.data || []);
    } catch (error) {
      console.error('댄서 목록 조회 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedDancer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (dancer: Dancer) => {
    setSelectedDancer(dancer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/dancers?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '삭제에 실패했습니다.');
      }
      
      await fetchDancers();
    } catch (error) {
      console.error('댄서 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSave = async (dancerData: Partial<Dancer>) => {
    try {
      // 빈 문자열을 null로 변환하는 헬퍼 함수
      const cleanData = (data: Partial<Dancer>): any => {
        const cleaned: any = {};
        Object.keys(data).forEach((key) => {
          const field = key as keyof Dancer;
          const value = data[field];
          
          // gender 필드는 특별 처리: 빈 문자열이면 null
          if (field === 'gender') {
            cleaned[field] = value === '' || value === null ? null : value;
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
      const cleanedData = cleanData(dancerData);
      // dance_team_id는 dancers 테이블에 없으므로 제거
      delete cleanedData.dance_team_id;

      let savedDancerId: number;

      if (selectedDancer) {
        savedDancerId = selectedDancer.id;
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
      } else {
        // nickname_ko, nickname_en, real_name 중 하나는 필수
        if (!dancerData.nickname_ko?.trim() && !dancerData.nickname_en?.trim() && !dancerData.real_name?.trim()) {
          alert('한국어 닉네임, 영어 닉네임, 실명 중 하나는 필수로 입력해야 합니다.');
          return;
        }
        
        const response = await fetch('/api/dancers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...cleanedData,
            bu_code: 'GRIGO', // 기본값, 필요시 수정
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

      // dancer_team_mapping 처리
      if (savedDancerId) {
        const { supabase } = await import('@/lib/supabase');
        
        // 기존 매핑 삭제
        const { error: deleteError } = await (supabase as any)
          .from('dancer_team_mapping')
          .delete()
          .eq('dancer_id', savedDancerId);
        
        if (deleteError) {
          console.error('기존 팀 매핑 삭제 실패:', deleteError);
        }
        
        // 새로운 매핑 추가 (팀이 선택된 경우)
        if (danceTeamId) {
          const { error: insertError } = await (supabase as any)
            .from('dancer_team_mapping')
            .insert({
              dancer_id: savedDancerId,
              dance_team_id: danceTeamId,
              created_at: new Date().toISOString(),
            });
          
          if (insertError) {
            console.error('팀 매핑 저장 실패:', insertError);
            alert('댄서는 저장되었지만 팀 매핑 저장에 실패했습니다.');
          }
        }
      }

      setIsModalOpen(false);
      setSelectedDancer(null);
      await fetchDancers();
    } catch (error) {
      console.error('댄서 저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">댄서 관리</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            댄서 추가
          </button>
        </div>

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
          <DancerTable dancers={filteredDancers} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        <DancerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDancer(null);
          }}
          onSave={handleSave}
          dancer={selectedDancer}
        />
      </div>
    </DashboardLayout>
  );
}

