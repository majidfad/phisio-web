import type { TableProps } from 'antd';
import { Table } from 'antd';

export function AppTable<RecordType extends object>(props: TableProps<RecordType>) {
  const { className, ...rest } = props;
  return <Table {...rest} className={['app-table', className].filter(Boolean).join(' ')} />;
}
