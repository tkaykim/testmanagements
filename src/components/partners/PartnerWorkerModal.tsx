'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Tables } from '@/types/database';

type PartnerWorker = Tables<'partner_worker'>;

interface PartnerWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (worker: Partial<PartnerWorker>) => void;
  worker?: PartnerWorker | null;
  partnerCompanies?: Array<{ id: number; company_name_ko: string | null }>;
}

export const PartnerWorkerModal: React.FC<PartnerWorkerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  worker,
  partnerCompanies = [],
}) => {
  const [formData, setFormData] = useState<Partial<PartnerWorker>>({
    name: '',
    name_ko: '',
    name_en: '',
    email: '',
    phone: '',
    worker_type: '',
    is_active: true,
    partner_company_id: null,
    notes: '',
  });

  useEffect(() => {
    if (worker) {
      setFormData(worker);
    } else {
      setFormData({
        name: '',
        name_ko: '',
        name_en: '',
        email: '',
        phone: '',
        worker_type: '',
        is_active: true,
        partner_company_id: null,
        notes: '',
      });
    }
  }, [worker, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof PartnerWorker, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={worker ? '파트너 워커 수정' : '파트너 워커 추가'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름 (한글)</label>
            <input
              type="text"
              value={formData.name_ko || ''}
              onChange={(e) => handleChange('name_ko', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름 (영문)</label>
            <input
              type="text"
              value={formData.name_en || ''}
              onChange={(e) => handleChange('name_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">워커 타입 *</label>
            <input
              type="text"
              required
              value={formData.worker_type || ''}
              onChange={(e) => handleChange('worker_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">파트너 회사</label>
            <select
              value={formData.partner_company_id || ''}
              onChange={(e) =>
                handleChange('partner_company_id', e.target.value ? parseInt(e.target.value) : null)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택하세요</option>
              {partnerCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company_name_ko || `회사 ID: ${company.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active || false}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">활성 상태</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

