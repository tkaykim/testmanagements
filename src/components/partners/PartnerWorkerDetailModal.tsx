'use client';

import React, { useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Tables } from '@/types/database';

type PartnerWorker = Tables<'partner_worker'>;

interface PartnerWorkerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: PartnerWorker | null;
  companyName?: string | null;
  companyIndustry?: string | null;
  onEdit: (worker: PartnerWorker) => void;
  onDelete: (id: number) => void | Promise<void>;
}

export const PartnerWorkerDetailModal: React.FC<PartnerWorkerDetailModalProps> = ({
  isOpen,
  onClose,
  worker,
  companyName,
  companyIndustry,
  onEdit,
  onDelete,
}) => {
  const displayName = useMemo(() => {
    if (!worker) return '-';
    return worker.name || worker.name_ko || worker.name_en || '-';
  }, [worker]);

  if (!worker) return null;

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-900 break-words">{value}</div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="파트너 워커 상세">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-900 truncate">{displayName}</div>
            <div className="text-sm text-gray-500 truncate">{worker.email || ''}</div>
          </div>
          <span
            className={`shrink-0 px-2 py-1 text-xs rounded-full ${
              worker.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {worker.is_active ? '활성' : '비활성'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="전화번호" value={worker.phone || '-'} />
          <Field label="워커 타입" value={worker.worker_type || '-'} />
          <Field label="회사" value={companyName || (worker.partner_company_id ? `회사 ID: ${worker.partner_company_id}` : '-') } />
          <Field label="업종" value={companyIndustry || '-'} />
          <Field label="메모" value={worker.notes || '-'} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={async () => {
              if (!confirm('정말 삭제하시겠습니까?')) return;
              await onDelete(worker.id);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
          >
            삭제
          </button>
          <button
            type="button"
            onClick={() => onEdit(worker)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            수정
          </button>
        </div>
      </div>
    </Modal>
  );
};

