import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';

import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';

interface AdminStatusTabsProps {
  value: AdminListFilter;
  onChange: (value: AdminListFilter) => void;
}

export function AdminStatusTabs({ value, onChange }: AdminStatusTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="filter-bar">
      <Segmented
        block
        size="large"
        value={value}
        onChange={(v) => onChange(v as AdminListFilter)}
        options={[
          { label: t('admin.common.tabs.active'), value: 'active' },
          { label: t('admin.common.tabs.inactive'), value: 'inactive' },
        ]}
      />
    </div>
  );
}
