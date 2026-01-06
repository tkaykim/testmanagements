'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PartnerCompanyTable } from '@/components/partners/PartnerCompanyTable';
import { PartnerWorkerTable } from '@/components/partners/PartnerWorkerTable';
import { PartnerCompanyModal } from '@/components/partners/PartnerCompanyModal';
import { PartnerWorkerModal } from '@/components/partners/PartnerWorkerModal';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database';

type PartnerCompany = Tables<'partner_company'>;
type PartnerWorker = Tables<'partner_worker'>;

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'workers'>('companies');
  const [companies, setCompanies] = useState<PartnerCompany[]>([]);
  const [workers, setWorkers] = useState<PartnerWorker[]>([]);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<PartnerCompany | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<PartnerWorker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'companies') {
      fetchCompanies();
    } else {
      fetchWorkers();
    }
  }, [activeTab]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partner_company')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('파트너 회사 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partner_worker')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkers(data || []);
    } catch (error) {
      console.error('파트너 워커 목록 조회 실패:', error);
    } finally {
      setLoading(false);
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
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
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
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
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

        {loading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : activeTab === 'companies' ? (
          <PartnerCompanyTable
            companies={companies}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
          />
        ) : (
          <PartnerWorkerTable workers={workers} onEdit={handleEditWorker} onDelete={handleDeleteWorker} />
        )}

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

