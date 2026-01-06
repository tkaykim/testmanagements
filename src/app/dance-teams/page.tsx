'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DanceTeamTable } from '@/components/dance-teams/DanceTeamTable';
import { DanceTeamModal } from '@/components/dance-teams/DanceTeamModal';
import { supabase } from '@/lib/supabase';

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

export default function DanceTeamsPage() {
  const [teams, setTeams] = useState<DanceTeam[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<DanceTeam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('dance_team')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('댄스팀 목록 조회 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedTeam(null);
    setIsModalOpen(true);
  };

  const handleEdit = (team: DanceTeam) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
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

      await fetchTeams();
    } catch (error) {
      console.error('댄스팀 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSave = async (teamData: Partial<DanceTeam>) => {
    try {
      if (selectedTeam) {
        const { error } = await (supabase as any)
          .from('dance_team')
          .update({ ...teamData, updated_at: new Date().toISOString() })
          .eq('id', selectedTeam.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from('dance_team').insert({
          ...teamData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
      setIsModalOpen(false);
      setSelectedTeam(null);
      await fetchTeams();
    } catch (error) {
      console.error('댄스팀 저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">댄스팀 관리</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            댄스팀 추가
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : (
          <DanceTeamTable teams={teams} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        <DanceTeamModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTeam(null);
          }}
          onSave={handleSave}
          team={selectedTeam}
        />
      </div>
    </DashboardLayout>
  );
}

