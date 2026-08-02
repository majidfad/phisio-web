import type { TableProps } from 'antd';
import { Table } from 'antd';

/**
 * Shared data table with a mobile-safe horizontal scroll container.
 * Defaults `scroll.x` to `max-content` so columns stay accessible on small screens
 * without expanding the page width. Pass `scroll={false}` or a custom `scroll`
 * object to override.
 */
export function AppTable<RecordType extends object>(props: TableProps<RecordType>) {
  const { className, scroll, ...rest } = props;
  const resolvedScroll =
    scroll === undefined ? { x: 'max-content' as const } : scroll === false ? undefined : scroll;

  return (
    <div className="app-table-scroll">
      <Table
        {...rest}
        scroll={resolvedScroll}
        className={['app-table', className].filter(Boolean).join(' ')}
      />
    </div>
  );
}
