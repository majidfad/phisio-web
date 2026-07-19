import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';

import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';

interface AdminStatusTabsProps {
  value: AdminListFilter;
  onChange: (value: AdminListFilter) => void;
  /** Optional label overrides, e.g. showing "pending approval" instead of "inactive". */
  labels?: Partial<Record<AdminListFilter, string>>;
}

export function AdminStatusTabs({ value, onChange, labels }: AdminStatusTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="filter-bar">
      <Segmented
        block
        size="large"
        value={value}
        onChange={(v) => onChange(v as AdminListFilter)}
        options={[
          { label: labels?.active ?? t('admin.common.tabs.active'), value: 'active' },
          { label: labels?.inactive ?? t('admin.common.tabs.inactive'), value: 'inactive' },
        ]}
      />
    </div>
  );
}
