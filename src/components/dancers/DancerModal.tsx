'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Tables } from '@/types/database';

type Dancer = Tables<'dancers'>;

interface PartnerCompany {
  id: number;
  company_name_ko: string | null;
  company_name_en: string | null;
}

interface DanceTeam {
  id: number;
  name_ko: string;
  name_en: string | null;
}

interface PartnerWorker {
  id: number;
  name: string | null;
  name_ko: string | null;
  name_en: string | null;
  phone: string | null;
  email: string | null;
  partner_company_id: number | null;
}

interface DancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dancer: Partial<Dancer>) => void;
  dancer?: Dancer | null;
}

export const DancerModal: React.FC<DancerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dancer,
}) => {
  const [formData, setFormData] = useState<Partial<Dancer>>({
    team_name: '',
    contact: '',
    nationality: '',
    gender: null,
    nickname_ko: '',
    nickname_en: '',
    real_name: '',
    partner_company_id: null,
    note: '',
    contract_start: null,
    contract_end: null,
    visa_type: null,
    visa_start: null,
    visa_end: null,
  });
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [partnerCompanies, setPartnerCompanies] = useState<PartnerCompany[]>([]);
  const [danceTeams, setDanceTeams] = useState<DanceTeam[]>([]);
  const [partnerWorkers, setPartnerWorkers] = useState<PartnerWorker[]>([]);
  
  // 파트너회사 검색 관련
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<PartnerCompany | null>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  
  // 팀명 검색 관련
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<DanceTeam | null>(null);
  const teamDropdownRef = useRef<HTMLDivElement>(null);
  
  // 담당자 검색 관련
  const [workerSearchQuery, setWorkerSearchQuery] = useState('');
  const [showWorkerDropdown, setShowWorkerDropdown] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<PartnerWorker | null>(null);
  const workerDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPartnerCompanies();
    fetchDanceTeams();
    fetchPartnerWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 모달이 열릴 때 소속 댄서(partner_company_id = 9)인 경우 회사 정보 자동 설정
  useEffect(() => {
    if (isOpen && partnerCompanies.length > 0) {
      // 댄서가 있고 partner_company_id가 9인 경우
      if (dancer?.partner_company_id === 9) {
        const grigoCompany = partnerCompanies.find((c) => c.id === 9);
        if (grigoCompany && !selectedCompany) {
          setSelectedCompany(grigoCompany);
          setCompanySearchQuery(grigoCompany.company_name_ko || grigoCompany.company_name_en || '');
        }
      }
      // 새 댄서 추가 시 소속 댄서 관리 페이지에서 열린 경우
      else if (!dancer && formData.partner_company_id === 9) {
        const grigoCompany = partnerCompanies.find((c) => c.id === 9);
        if (grigoCompany && !selectedCompany) {
          setSelectedCompany(grigoCompany);
          setCompanySearchQuery(grigoCompany.company_name_ko || grigoCompany.company_name_en || '');
        }
      }
    }
  }, [isOpen, partnerCompanies, dancer, selectedCompany, formData.partner_company_id]);

  // 회사 선택이 변경되면 담당자 목록 다시 불러오기
  useEffect(() => {
    fetchPartnerWorkers();
    // 회사가 변경되면 선택된 담당자 초기화
    setSelectedWorker(null);
    setWorkerSearchQuery('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany?.id]);

  useEffect(() => {
    if (dancer) {
      setFormData(dancer);
      
      // 파트너회사 설정
      if (dancer.partner_company_id) {
        const company = partnerCompanies.find((c) => c.id === dancer.partner_company_id);
        if (company) {
          setSelectedCompany(company);
          setCompanySearchQuery(company.company_name_ko || company.company_name_en || '');
        }
      } else {
        setSelectedCompany(null);
        setCompanySearchQuery('');
      }
      
      // 팀명 설정 - dancer_team_mapping에서 팀 정보 가져오기 (dancer.id가 있을 때만)
      const fetchDancerTeam = async () => {
        // 새 댄서 추가 시에는 팀 매핑 조회 불필요
        if (!dancer.id) {
          setSelectedTeam(null);
          setSelectedTeamId(null);
          setTeamSearchQuery('');
          return;
        }
        
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data: mapping, error } = await supabase
            .from('dancer_team_mapping')
            .select('dance_team_id')
            .eq('dancer_id', dancer.id)
            .maybeSingle();
          
          if (!error && mapping && mapping.dance_team_id) {
            const team = danceTeams.find((t) => t.id === mapping.dance_team_id);
            if (team) {
              setSelectedTeam(team);
              setSelectedTeamId(team.id);
              setTeamSearchQuery(team.name_ko || team.name_en || '');
            } else {
              // 팀 목록에 없으면 팀 정보를 직접 가져오기
              const { data: teamData, error: teamError } = await supabase
                .from('dance_team')
                .select('*')
                .eq('id', mapping.dance_team_id)
                .single();
              
              if (!teamError && teamData) {
                setSelectedTeam(teamData);
                setSelectedTeamId(teamData.id);
                setTeamSearchQuery(teamData.name_ko || teamData.name_en || '');
              }
            }
          } else {
            // 기존 team_name 필드가 있으면 사용 (하위 호환성)
            if (dancer.team_name) {
              const team = danceTeams.find((t) => 
                t.name_ko === dancer.team_name || t.name_en === dancer.team_name
              );
              if (team) {
                setSelectedTeam(team);
                setSelectedTeamId(team.id);
                setTeamSearchQuery(team.name_ko || team.name_en || '');
              } else {
                setSelectedTeam(null);
                setSelectedTeamId(null);
                setTeamSearchQuery(dancer.team_name);
              }
            } else {
              setSelectedTeam(null);
              setSelectedTeamId(null);
              setTeamSearchQuery('');
            }
          }
        } catch (error) {
          console.error('팀 정보 조회 실패:', error);
          setSelectedTeam(null);
          setSelectedTeamId(null);
          setTeamSearchQuery('');
        }
      };
      
      fetchDancerTeam();
      
      // 담당자 설정 - partnerWorkers가 로드된 후에 설정
      if ((dancer as any).partner_worker_id) {
        // partnerWorkers가 아직 로드되지 않았으면 나중에 설정
        if (partnerWorkers.length > 0) {
          const worker = partnerWorkers.find((w) => w.id === (dancer as any).partner_worker_id);
          if (worker) {
            setSelectedWorker(worker);
            setWorkerSearchQuery(worker.name_ko || worker.name_en || worker.name || '');
          } else {
            // 담당자가 선택된 회사의 담당자가 아니면 전체 목록에서 찾기
            fetch(`/api/partner-workers`)
              .then(res => res.json())
              .then(result => {
                if (result.data) {
                  const worker = result.data.find((w: PartnerWorker) => w.id === (dancer as any).partner_worker_id);
                  if (worker) {
                    setSelectedWorker(worker);
                    setWorkerSearchQuery(worker.name_ko || worker.name_en || worker.name || '');
                  }
                }
              })
              .catch(err => console.error('담당자 정보 조회 실패:', err));
          }
        }
      } else {
        setSelectedWorker(null);
        setWorkerSearchQuery('');
      }
    } else {
      // 새 댄서 추가 시, dancer prop에 partner_company_id가 있으면 자동 설정
      const initialPartnerCompanyId = (dancer as any)?.partner_company_id || null;
      
      setFormData({
        team_name: '',
        contact: '',
        nationality: '',
        gender: null,
        nickname_ko: '',
        nickname_en: '',
        real_name: '',
        partner_company_id: initialPartnerCompanyId,
        note: '',
        contract_start: null,
        contract_end: null,
        visa_type: null,
        visa_start: null,
        visa_end: null,
      });
      setSelectedCompany(null);
      setCompanySearchQuery('');
      setSelectedTeam(null);
      setTeamSearchQuery('');
      setSelectedWorker(null);
      setWorkerSearchQuery('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dancer, isOpen, partnerCompanies, danceTeams]);

  // partnerWorkers가 로드된 후 담당자 정보 설정
  useEffect(() => {
    if (dancer && (dancer as any).partner_worker_id && partnerWorkers.length > 0) {
      const worker = partnerWorkers.find((w) => w.id === (dancer as any).partner_worker_id);
      if (worker && !selectedWorker) {
        setSelectedWorker(worker);
        setWorkerSearchQuery(worker.name_ko || worker.name_en || worker.name || '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerWorkers, dancer]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node)) {
        setShowTeamDropdown(false);
      }
      if (workerDropdownRef.current && !workerDropdownRef.current.contains(event.target as Node)) {
        setShowWorkerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const fetchDanceTeams = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('dance_team')
        .select('id, name_ko, name_en')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDanceTeams(data || []);
    } catch (error) {
      console.error('댄스팀 목록 조회 실패:', error);
    }
  };

  const fetchPartnerWorkers = async () => {
    try {
      const companyId = selectedCompany?.id;
      const url = companyId 
        ? `/api/partner-workers?company_id=${companyId}`
        : '/api/partner-workers';
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (response.ok) {
        setPartnerWorkers(result.data || []);
      }
    } catch (error) {
      console.error('파트너 워커 목록 조회 실패:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // nickname_ko, nickname_en, real_name 중 하나는 필수
    if (!formData.nickname_ko?.trim() && !formData.nickname_en?.trim() && !formData.real_name?.trim()) {
      alert('한국어 닉네임, 영어 닉네임, 실명 중 하나는 필수로 입력해야 합니다.');
      return;
    }
    
    // team_name을 제외하고 저장 (DB에 컬럼이 없을 수 있음)
    const { team_name, ...restData } = formData;
    
    // 빈 문자열을 null로 변환 (DB 제약 조건 위반 방지)
    const submitData: any = {};
    
      // 나머지 필드들 처리
    Object.keys(restData).forEach((key) => {
      const field = key as keyof Dancer;
      let value = restData[field];
      
      // gender 필드는 특별 처리: 빈 문자열이거나 undefined면 null
      if (field === 'gender') {
        submitData[field] = (value === '' || value === null || value === undefined) ? null : value;
      }
      // 날짜 필드 처리 (contract_start, contract_end, visa_start, visa_end)
      else if (field === 'contract_start' || field === 'contract_end' || field === 'visa_start' || field === 'visa_end') {
        submitData[field] = (value === '' || value === null || value === undefined) ? null : value;
      }
      // 문자열 필드인 경우 빈 문자열을 null로 변환
      else if (typeof value === 'string') {
        const trimmed = value.trim();
        submitData[field] = trimmed === '' ? null : trimmed;
      } else {
        submitData[field] = value;
      }
    });
    
    // gender 필드가 없거나 빈 문자열인 경우 명시적으로 null 설정
    if (!submitData.gender || submitData.gender === '') {
      submitData.gender = null;
    }
    
    // 팀 ID를 별도로 전달 (dancer_team_mapping 저장용)
    (submitData as any).dance_team_id = selectedTeamId;
    
    onSave(submitData);
  };

  const handleChange = (field: keyof Dancer, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleTeamSearch = (query: string) => {
    setTeamSearchQuery(query);
    setShowTeamDropdown(true);
  };

  const handleTeamSelect = (team: DanceTeam) => {
    setSelectedTeam(team);
    setSelectedTeamId(team.id);
    const teamName = team.name_ko || team.name_en || '';
    setTeamSearchQuery(teamName);
    setFormData((prev) => ({ ...prev, team_name: teamName }));
    setShowTeamDropdown(false);
  };

  const handleTeamClear = () => {
    setSelectedTeam(null);
    setSelectedTeamId(null);
    setTeamSearchQuery('');
    setFormData((prev) => ({ ...prev, team_name: '' }));
    setShowTeamDropdown(false);
  };

  const handleWorkerSearch = (query: string) => {
    setWorkerSearchQuery(query);
    setShowWorkerDropdown(true);
  };

  const handleWorkerSelect = (worker: PartnerWorker) => {
    setSelectedWorker(worker);
    const workerName = worker.name_ko || worker.name_en || worker.name || '';
    setWorkerSearchQuery(workerName);
    setFormData((prev) => ({ ...prev, partner_worker_id: worker.id }));
    setShowWorkerDropdown(false);
  };

  const handleWorkerClear = () => {
    setSelectedWorker(null);
    setWorkerSearchQuery('');
    setFormData((prev) => ({ ...prev, partner_worker_id: null }));
    setShowWorkerDropdown(false);
  };

  const filteredCompanies = partnerCompanies.filter((company) => {
    const query = companySearchQuery.toLowerCase();
    const nameKo = (company.company_name_ko || '').toLowerCase();
    const nameEn = (company.company_name_en || '').toLowerCase();
    return nameKo.includes(query) || nameEn.includes(query);
  });

  const filteredTeams = danceTeams.filter((team) => {
    const query = teamSearchQuery.toLowerCase();
    const nameKo = (team.name_ko || '').toLowerCase();
    const nameEn = (team.name_en || '').toLowerCase();
    return nameKo.includes(query) || nameEn.includes(query);
  });

  const filteredWorkers = partnerWorkers.filter((worker) => {
    const query = workerSearchQuery.toLowerCase();
    const name = (worker.name || '').toLowerCase();
    const nameKo = (worker.name_ko || '').toLowerCase();
    const nameEn = (worker.name_en || '').toLowerCase();
    const phone = (worker.phone || '').toLowerCase();
    return (
      name.includes(query) ||
      nameKo.includes(query) ||
      nameEn.includes(query) ||
      phone.includes(query)
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dancer ? '댄서 수정' : '댄서 추가'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              한국어 닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nickname_ko || ''}
              onChange={(e) => handleChange('nickname_ko', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              영어 닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nickname_en || ''}
              onChange={(e) => handleChange('nickname_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            실명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.real_name || ''}
            onChange={(e) => handleChange('real_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            한국어 닉네임, 영어 닉네임, 실명 중 하나는 필수로 입력해야 합니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
            <input
              type="text"
              value={formData.contact || ''}
              onChange={(e) => handleChange('contact', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">국적</label>
            <input
              type="text"
              value={formData.nationality || ''}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
            <select
              value={formData.gender || ''}
              onChange={(e) => {
                const value = e.target.value;
                handleChange('gender', value === '' ? null : value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택하세요</option>
              <option value="male">남</option>
              <option value="female">여</option>
            </select>
          </div>

          <div className="relative" ref={teamDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">팀명</label>
            <div className="relative">
              <input
                type="text"
                value={teamSearchQuery}
                onChange={(e) => handleTeamSearch(e.target.value)}
                onFocus={() => setShowTeamDropdown(true)}
                placeholder="팀명 검색..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {selectedTeam && (
                <button
                  type="button"
                  onClick={handleTeamClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
              {showTeamDropdown && filteredTeams.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredTeams.map((team) => (
                    <div
                      key={team.id}
                      onClick={() => handleTeamSelect(team)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      <div className="font-medium">
                        {team.name_ko || team.name_en}
                      </div>
                      {team.name_ko && team.name_en && (
                        <div className="text-sm text-gray-500">{team.name_en}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {showTeamDropdown && teamSearchQuery && filteredTeams.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative" ref={companyDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">회사</label>
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

        <div className="relative" ref={workerDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
          <div className="relative">
            <input
              type="text"
              value={workerSearchQuery}
              onChange={(e) => handleWorkerSearch(e.target.value)}
              onFocus={() => setShowWorkerDropdown(true)}
              placeholder="이름 또는 전화번호로 검색..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {selectedWorker && (
              <button
                type="button"
                onClick={handleWorkerClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
            {showWorkerDropdown && filteredWorkers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    onClick={() => handleWorkerSelect(worker)}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    <div className="font-medium">
                      {worker.name_ko || worker.name_en || worker.name || '이름 없음'}
                    </div>
                    {worker.phone && (
                      <div className="text-sm text-gray-500">{worker.phone}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {showWorkerDropdown && workerSearchQuery && filteredWorkers.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
          <textarea
            value={formData.note || ''}
            onChange={(e) => handleChange('note', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 소속 댄서(그리고 엔터테인먼트)일 때만 계약/비자 정보 표시 */}
        {(formData.partner_company_id === 9 || selectedCompany?.id === 9) && (
          <>
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">계약 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    계약 시작일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.contract_start ? new Date(formData.contract_start).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange('contract_start', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    계약 종료일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.contract_end ? new Date(formData.contract_end).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange('contract_end', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">비자 정보</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">비자 유형</label>
                  <select
                    value={formData.visa_type || ''}
                    onChange={(e) => handleChange('visa_type', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="E-6">E-6 (예술흥행)</option>
                    <option value="F-4">F-4 (재외동포)</option>
                    <option value="F-5">F-5 (영주)</option>
                    <option value="F-6">F-6 (결혼이민)</option>
                    <option value="H-1">H-1 (방문취업)</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">비자 시작일</label>
                  <input
                    type="date"
                    value={formData.visa_start ? new Date(formData.visa_start).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange('visa_start', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">비자 종료일</label>
                  <input
                    type="date"
                    value={formData.visa_end ? new Date(formData.visa_end).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange('visa_end', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    무기한 비자는 9999-12-31로 입력하세요
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

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

