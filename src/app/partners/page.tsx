'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PartnerCompanyTable } from '@/components/partners/PartnerCompanyTable';
import { PartnerWorkerTable } from '@/components/partners/PartnerWorkerTable';
import { PartnerCompanyModal } from '@/components/partners/PartnerCompanyModal';
import { PartnerWorkerModal } from '@/components/partners/PartnerWorkerModal';
import { PartnerCompanyDetailModal } from '@/components/partners/PartnerCompanyDetailModal';
import { PartnerWorkerDetailModal } from '@/components/partners/PartnerWorkerDetailModal';
import { getSupabaseClient } from '@/lib/supabase';
import { Tables } from '@/types/database';

type PartnerCompany = Tables<'partner_company'>;
type PartnerWorker = Tables<'partner_worker'>;

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'workers'>('companies');
  const [companies, setCompanies] = useState<PartnerCompany[]>([]);
  const [workers, setWorkers] = useState<PartnerWorker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [isCompanyDetailOpen, setIsCompanyDetailOpen] = useState(false);
  const [isWorkerDetailOpen, setIsWorkerDetailOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<PartnerCompany | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<PartnerWorker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 검색/드롭다운(워커의 회사 선택)을 위해 회사/워커를 모두 한 번 로드
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchCompanies({ silent: true }), fetchWorkers({ silent: true })]);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCompanies = async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase 환경변수가 설정되어 있지 않습니다.');

      const { data, error } = await supabase
        .from('partner_company')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('파트너 회사 목록 조회 실패:', error);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  };

  const fetchWorkers = async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase 환경변수가 설정되어 있지 않습니다.');

      const { data, error } = await supabase
        .from('partner_worker')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkers(data || []);
    } catch (error) {
      console.error('파트너 워커 목록 조회 실패:', error);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsCompanyModalOpen(true);
  };

  const handleEditCompany = (company: PartnerCompany) => {
    setSelectedCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleDeleteCompany = async (id: number) => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase 환경변수가 설정되어 있지 않습니다.');

      const { error } = await supabase.from('partner_company').delete().eq('id', id);
      if (error) throw error;
      await fetchCompanies();
    } catch (error) {
      console.error('파트너 회사 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSaveCompany = async (companyData: Partial<PartnerCompany>) => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase 환경변수가 설정되어 있지 않습니다.');

      if (selectedCompany) {
        const { error } = await supabase
          .from('partner_company')
          .update({ ...companyData, updated_at: new Date().toISOString() })
          .eq('id', selectedCompany.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('partner_company').insert({
          ...companyData,
          bu_code: 'GRIGO', // 기본값, 필요시 수정
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
      setIsCompanyModalOpen(false);
      setSelectedCompany(null);
      await fetchCompanies();
    } catch (error) {
      console.error('파트너 회사 저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleAddWorker = () => {
    setSelectedWorker(null);
    setIsWorkerModalOpen(true);
  };

  const handleEditWorker = (worker: PartnerWorker) => {
    setSelectedWorker(worker);
    setIsWorkerModalOpen(true);
  };

  const handleDeleteWorker = async (id: number) => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase 환경변수가 설정되어 있지 않습니다.');

      const { error } = await supabase.from('partner_worker').delete().eq('id', id);
      if (error) throw error;
      await fetchWorkers();
    } catch (error) {
      console.error('파트너 워커 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSaveWorker = async (workerData: Partial<PartnerWorker>) => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase 환경변수가 설정되어 있지 않습니다.');

      if (selectedWorker) {
        const { error } = await supabase
          .from('partner_worker')
          .update({ ...workerData, updated_at: new Date().toISOString() })
          .eq('id', selectedWorker.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('partner_worker').insert({
          ...workerData,
          bu_code: 'GRIGO', // 기본값, 필요시 수정
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
      setIsWorkerModalOpen(false);
      setSelectedWorker(null);
      await fetchWorkers();
    } catch (error) {
      console.error('파트너 워커 저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const companyById = useMemo(() => {
    const map = new Map<number, PartnerCompany>();
    for (const c of companies) map.set(c.id, c);
    return map;
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return companies;
    const includes = (v: string | null) => (v || '').toLowerCase().includes(q);
    return companies.filter(
      (c) => includes(c.company_name_ko) || includes(c.company_name_en) || includes(c.industry)
    );
  }, [companies, searchQuery]);

  const filteredWorkers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return workers;
    const includes = (v: string | null) => (v || '').toLowerCase().includes(q);
    return workers.filter((w) => {
      const company = w.partner_company_id ? companyById.get(w.partner_company_id) : undefined;
      return (
        includes(w.name) ||
        includes(w.name_ko) ||
        includes(w.name_en) ||
        includes(company?.company_name_ko ?? null) ||
        includes(company?.company_name_en ?? null) ||
        includes(company?.industry ?? null)
      );
    });
  }, [workers, searchQuery, companyById]);

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">파트너 관리</h1>
          <button
            onClick={() => (activeTab === 'companies' ? handleAddCompany() : handleAddWorker())}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm md:text-base w-full sm:w-auto"
          >
            {activeTab === 'companies' ? '파트너 회사 추가' : '파트너 워커 추가'}
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 md:space-x-8">
            <button
              onClick={() => setActiveTab('companies')}
              className={`py-3 md:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'companies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              파트너 회사
            </button>
            <button
              onClick={() => setActiveTab('workers')}
              className={`py-3 md:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'workers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              파트너 워커
            </button>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex-1">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'companies'
                  ? '회사명/업종으로 검색'
                  : '직원명/회사명/업종으로 검색'
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              초기화
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : activeTab === 'companies' ? (
          <PartnerCompanyTable
            companies={filteredCompanies}
            onSelect={(company) => {
              setSelectedCompany(company);
              setIsCompanyDetailOpen(true);
            }}
          />
        ) : (
          <PartnerWorkerTable
            workers={filteredWorkers}
            onSelect={(worker) => {
              setSelectedWorker(worker);
              setIsWorkerDetailOpen(true);
            }}
          />
        )}

        <PartnerCompanyDetailModal
          isOpen={isCompanyDetailOpen}
          onClose={() => setIsCompanyDetailOpen(false)}
          company={selectedCompany}
          onEdit={(company) => {
            setIsCompanyDetailOpen(false);
            handleEditCompany(company);
          }}
          onDelete={handleDeleteCompany}
        />

        <PartnerWorkerDetailModal
          isOpen={isWorkerDetailOpen}
          onClose={() => setIsWorkerDetailOpen(false)}
          worker={selectedWorker}
          companyName={
            selectedWorker?.partner_company_id
              ? companyById.get(selectedWorker.partner_company_id)?.company_name_ko ?? null
              : null
          }
          companyIndustry={
            selectedWorker?.partner_company_id
              ? companyById.get(selectedWorker.partner_company_id)?.industry ?? null
              : null
          }
          onEdit={(worker) => {
            setIsWorkerDetailOpen(false);
            handleEditWorker(worker);
          }}
          onDelete={handleDeleteWorker}
        />

        <PartnerCompanyModal
          isOpen={isCompanyModalOpen}
          onClose={() => {
            setIsCompanyModalOpen(false);
            setSelectedCompany(null);
          }}
          onSave={handleSaveCompany}
          company={selectedCompany}
        />

        <PartnerWorkerModal
          isOpen={isWorkerModalOpen}
          onClose={() => {
            setIsWorkerModalOpen(false);
            setSelectedWorker(null);
          }}
          onSave={handleSaveWorker}
          worker={selectedWorker}
          partnerCompanies={companies.map((c) => ({ id: c.id, company_name_ko: c.company_name_ko }))}
        />
      </div>
    </DashboardLayout>
  );
}

