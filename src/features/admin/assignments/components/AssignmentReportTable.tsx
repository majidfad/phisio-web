import { Empty, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import type { AssignmentReportDto } from '@/features/admin/assignments/types/assignment-report';
import { formatAssignmentExercises } from '@/features/admin/assignments/utils/format-assignment-exercises';

interface AssignmentReportTableProps {
  rows: AssignmentReportDto[];
}

export function AssignmentReportTable({ rows }: AssignmentReportTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<AssignmentReportDto> = [
    {
      title: t('admin.assignments.columns.patient'),
      dataIndex: 'patientName',
      key: 'patientName',
      width: 180,
    },
    {
      title: t('admin.assignments.columns.doctor'),
      dataIndex: 'doctorName',
      key: 'doctorName',
      width: 180,
    },
    {
      title: t('admin.assignments.columns.exercises'),
      key: 'exercises',
      ellipsis: true,
      render: (_, row) =>
        formatAssignmentExercises(row.exerciseNames, t('admin.assignments.noExercises')),
    },
  ];

  if (rows.length === 0) {
    return <Empty description={t('admin.assignments.empty')} />;
  }

  return (
    <Table
      rowKey={(row, index) => `${row.patientName}-${row.doctorName}-${index}`}
      columns={columns}
      dataSource={rows}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      size="middle"
    />
  );
}
