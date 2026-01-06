'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
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

interface PartnerCompany {
  id: number;
  company_name_ko: string | null;
  company_name_en: string | null;
}

interface DanceTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: Partial<DanceTeam>) => void;
  team?: DanceTeam | null;
}

export const DanceTeamModal: React.FC<DanceTeamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  team,
}) => {
  const [formData, setFormData] = useState<Partial<DanceTeam>>({
    name_ko: '',
    name_en: '',
    nationality: '',
    logo: '',
    photo: '',
    leader_id: null,
    partner_company_id: null,
  });
  const [dancers, setDancers] = useState<Dancer[]>([]);
  const [partnerCompanies, setPartnerCompanies] = useState<PartnerCompany[]>([]);
  
  // 리더 검색 관련
  const [leaderSearchQuery, setLeaderSearchQuery] = useState('');
  const [showLeaderDropdown, setShowLeaderDropdown] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<Dancer | null>(null);
  const leaderDropdownRef = useRef<HTMLDivElement>(null);
  
  // 파트너회사 검색 관련
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<PartnerCompany | null>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDancers();
    fetchPartnerCompanies();
  }, []);

  useEffect(() => {
    if (team) {
      setFormData(team);
      
      // 리더 설정
      if (team.leader_id) {
        const leader = dancers.find((d) => d.id === team.leader_id);
        if (leader) {
          setSelectedLeader(leader);
          setLeaderSearchQuery(
            leader.nickname_ko || leader.nickname_en || leader.real_name || ''
          );
        }
      } else {
        setSelectedLeader(null);
        setLeaderSearchQuery('');
      }
      
      // 파트너회사 설정
      if (team.partner_company_id) {
        const company = partnerCompanies.find((c) => c.id === team.partner_company_id);
        if (company) {
          setSelectedCompany(company);
          setCompanySearchQuery(company.company_name_ko || company.company_name_en || '');
        }
      } else {
        setSelectedCompany(null);
        setCompanySearchQuery('');
      }
    } else {
      setFormData({
        name_ko: '',
        name_en: '',
        nationality: '',
        logo: '',
        photo: '',
        leader_id: null,
        partner_company_id: null,
      });
      setSelectedLeader(null);
      setLeaderSearchQuery('');
      setSelectedCompany(null);
      setCompanySearchQuery('');
    }
  }, [team, isOpen, dancers, partnerCompanies]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (leaderDropdownRef.current && !leaderDropdownRef.current.contains(event.target as Node)) {
        setShowLeaderDropdown(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchDancers = async () => {
    try {
      const response = await fetch('/api/dancers');
      const result = await response.json();
      if (response.ok) {
        setDancers(result.data || []);
      }
    } catch (error) {
      console.error('댄서 목록 조회 실패:', error);
    }
  };

  const fetchPartnerCompanies = async () => {
    try {
      const response = await fetch('/api/partner-companies');
      const result = await response.json();
      if (response.ok) {
        setPartnerCompanies(result.data || []);
      }
    } catch (error) {
      console.error('파트너 회사 목록 조회 실패:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 팀명 검증: 한글 또는 영문 중 최소 하나는 필수
    const nameKo = formData.name_ko?.trim() || '';
    const nameEn = formData.name_en?.trim() || '';
    
    if (!nameKo && !nameEn) {
      alert('팀명(한글) 또는 팀명(영문) 중 하나는 필수로 입력해주세요.');
      return;
    }
    
    // 빈 문자열은 null로 변환
    const submitData = {
      ...formData,
      name_ko: nameKo || null,
      name_en: nameEn || null,
    };
    
    onSave(submitData);
  };

  const handleLeaderSearch = (query: string) => {
    setLeaderSearchQuery(query);
    setShowLeaderDropdown(true);
  };

  const handleLeaderSelect = (dancer: Dancer) => {
    setSelectedLeader(dancer);
    setLeaderSearchQuery(dancer.nickname_ko || dancer.nickname_en || dancer.real_name || '');
    setFormData((prev) => ({ ...prev, leader_id: dancer.id }));
    setShowLeaderDropdown(false);
  };

  const handleLeaderClear = () => {
    setSelectedLeader(null);
    setLeaderSearchQuery('');
    setFormData((prev) => ({ ...prev, leader_id: null }));
    setShowLeaderDropdown(false);
  };

  const handleCompanySearch = (query: string) => {
    setCompanySearchQuery(query);
    setShowCompanyDropdown(true);
  };

  const handleCompanySelect = (company: PartnerCompany) => {
    setSelectedCompany(company);
    setCompanySearchQuery(company.company_name_ko || company.company_name_en || '');
    setFormData((prev) => ({ ...prev, partner_company_id: company.id }));
    setShowCompanyDropdown(false);
  };

  const handleCompanyClear = () => {
    setSelectedCompany(null);
    setCompanySearchQuery('');
    setFormData((prev) => ({ ...prev, partner_company_id: null }));
    setShowCompanyDropdown(false);
  };

  const filteredLeaders = dancers.filter((dancer) => {
    const query = leaderSearchQuery.toLowerCase();
    const nicknameKo = (dancer.nickname_ko || '').toLowerCase();
    const nicknameEn = (dancer.nickname_en || '').toLowerCase();
    const realName = (dancer.real_name || '').toLowerCase();
    return nicknameKo.includes(query) || nicknameEn.includes(query) || realName.includes(query);
  });

  const filteredCompanies = partnerCompanies.filter((company) => {
    const query = companySearchQuery.toLowerCase();
    const nameKo = (company.company_name_ko || '').toLowerCase();
    const nameEn = (company.company_name_en || '').toLowerCase();
    return nameKo.includes(query) || nameEn.includes(query);
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={team ? '댄스팀 수정' : '댄스팀 추가'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              팀명 (한글) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name_ko || ''}
              onChange={(e) => setFormData({ ...formData, name_ko: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="팀명(한글)을 입력하세요"
            />
            <p className="mt-1 text-xs text-gray-500">
              한글 또는 영문 중 하나는 필수입니다.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              팀명 (영문) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name_en || ''}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="팀명(영문)을 입력하세요"
            />
            <p className="mt-1 text-xs text-gray-500">
              한글 또는 영문 중 하나는 필수입니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">국적</label>
            <input
              type="text"
              value={formData.nationality || ''}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative" ref={leaderDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">리더</label>
            <div className="relative">
              <input
                type="text"
                value={leaderSearchQuery}
                onChange={(e) => handleLeaderSearch(e.target.value)}
                onFocus={() => setShowLeaderDropdown(true)}
                placeholder="리더 검색..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {selectedLeader && (
                <button
                  type="button"
                  onClick={handleLeaderClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
              {showLeaderDropdown && filteredLeaders.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredLeaders.map((dancer) => (
                    <div
                      key={dancer.id}
                      onClick={() => handleLeaderSelect(dancer)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      <div className="font-medium">
                        {dancer.nickname_ko || dancer.nickname_en || dancer.real_name || `ID: ${dancer.id}`}
                      </div>
                      {(dancer.nickname_ko || dancer.nickname_en) && dancer.real_name && (
                        <div className="text-sm text-gray-500">{dancer.real_name}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {showLeaderDropdown && leaderSearchQuery && filteredLeaders.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">로고 URL</label>
            <input
              type="text"
              value={formData.logo || ''}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사진 URL</label>
            <input
              type="text"
              value={formData.photo || ''}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="relative" ref={companyDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">파트너 회사</label>
          <div className="relative">
            <input
              type="text"
              value={companySearchQuery}
              onChange={(e) => handleCompanySearch(e.target.value)}
              onFocus={() => setShowCompanyDropdown(true)}
              placeholder="회사 검색..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {selectedCompany && (
              <button
                type="button"
                onClick={handleCompanyClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
            {showCompanyDropdown && filteredCompanies.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => handleCompanySelect(company)}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    <div className="font-medium">
                      {company.company_name_ko || company.company_name_en}
                    </div>
                    {company.company_name_ko && company.company_name_en && (
                      <div className="text-sm text-gray-500">{company.company_name_en}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {showCompanyDropdown && companySearchQuery && filteredCompanies.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </form>
    </Modal>
  );
};

