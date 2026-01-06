'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Tables } from '@/types/database';

type PartnerCompany = Tables<'partner_company'>;

interface PartnerCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Partial<PartnerCompany>) => void;
  company?: PartnerCompany | null;
}

export const PartnerCompanyModal: React.FC<PartnerCompanyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  company,
}) => {
  const [formData, setFormData] = useState<Partial<PartnerCompany>>({
    company_name_ko: '',
    company_name_en: '',
    partner_type: '',
    status: 'active',
    representative_name: '',
    business_registration_number: '',
    industry: '',
  });

  useEffect(() => {
    if (company) {
      setFormData(company);
    } else {
      setFormData({
        company_name_ko: '',
        company_name_en: '',
        partner_type: '',
        status: 'active',
        representative_name: '',
        business_registration_number: '',
        industry: '',
      });
    }
  }, [company, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof PartnerCompany, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={company ? '파트너 회사 수정' : '파트너 회사 추가'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              회사명 (한글) *
            </label>
            <input
              type="text"
              required
              value={formData.company_name_ko || ''}
              onChange={(e) => handleChange('company_name_ko', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">회사명 (영문)</label>
            <input
              type="text"
              value={formData.company_name_en || ''}
              onChange={(e) => handleChange('company_name_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">파트너 타입 *</label>
            <input
              type="text"
              required
              value={formData.partner_type || ''}
              onChange={(e) => handleChange('partner_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태 *</label>
            <select
              value={formData.status || 'active'}
              onChange={(e) => handleChange('status', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="archived">보관됨</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">대표자명</label>
          <input
            type="text"
            value={formData.representative_name || ''}
            onChange={(e) => handleChange('representative_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사업자 등록번호</label>
            <input
              type="text"
              value={formData.business_registration_number || ''}
              onChange={(e) => handleChange('business_registration_number', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">업종</label>
            <input
              type="text"
              value={formData.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

