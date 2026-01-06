'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Tables } from '@/types/database';

type PartnerCompany = Tables<'partner_company'>;

interface PartnerCompanyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: PartnerCompany | null;
  onEdit: (company: PartnerCompany) => void;
  onDelete: (id: number) => void | Promise<void>;
}

export const PartnerCompanyDetailModal: React.FC<PartnerCompanyDetailModalProps> = ({
  isOpen,
  onClose,
  company,
  onEdit,
  onDelete,
}) => {
  if (!company) return null;

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-900 break-words">{value}</div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="파트너 회사 상세">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-900 truncate">
              {company.company_name_ko || '-'}
            </div>
            <div className="text-sm text-gray-500 truncate">{company.company_name_en || ''}</div>
          </div>
          <span
            className={`shrink-0 px-2 py-1 text-xs rounded-full ${
              company.status === 'active'
                ? 'bg-green-100 text-green-800'
                : company.status === 'inactive'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
            }`}
          >
            {company.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="업종" value={company.industry || '-'} />
          <Field label="파트너 타입" value={company.partner_type || '-'} />
          <Field label="대표자명" value={company.representative_name || '-'} />
          <Field label="사업자 등록번호" value={company.business_registration_number || '-'} />
          <Field label="마지막 미팅" value={company.last_meeting_date || '-'} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={async () => {
              if (!confirm('정말 삭제하시겠습니까?')) return;
              await onDelete(company.id);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
          >
            삭제
          </button>
          <button
            type="button"
            onClick={() => onEdit(company)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            수정
          </button>
        </div>
      </div>
    </Modal>
  );
};

