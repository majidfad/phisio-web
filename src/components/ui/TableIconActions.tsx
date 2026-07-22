import { Pencil, Trash2 } from 'lucide-react';
import { Button, Space, Tooltip } from 'antd';

import { denseIconProps } from '@/components/icons/app-icon';

interface TableIconActionsProps {
  editLabel: string;
  deleteLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function TableIconActions({
  editLabel,
  deleteLabel,
  onEdit,
  onDelete,
}: TableIconActionsProps) {
  return (
    <Space size={4} className="table-icon-actions">
      <Tooltip title={editLabel}>
        <Button
          type="text"
          className="table-icon-actions__btn table-icon-actions__btn--edit"
          icon={<Pencil {...denseIconProps} />}
          aria-label={editLabel}
          onClick={onEdit}
        />
      </Tooltip>
      <Tooltip title={deleteLabel}>
        <Button
          type="text"
          danger
          className="table-icon-actions__btn table-icon-actions__btn--delete"
          icon={<Trash2 {...denseIconProps} />}
          aria-label={deleteLabel}
          onClick={onDelete}
        />
      </Tooltip>
    </Space>
  );
}
