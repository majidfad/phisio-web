import { CircleAlert, CircleCheck, Info, type LucideIcon, TriangleAlert } from 'lucide-react';
import { Result, type ResultProps } from 'antd';

const STATUS_ICONS: Record<string, LucideIcon> = {
  error: CircleAlert,
  warning: TriangleAlert,
  success: CircleCheck,
  info: Info,
  '403': CircleAlert,
  '404': Info,
  '500': CircleAlert,
};

/** Ant Result with Lucide status icons instead of Ant’s default illustrations. */
export function AppResult({ status = 'info', icon, ...props }: ResultProps) {
  const StatusIcon = STATUS_ICONS[String(status)] ?? Info;

  return (
    <Result
      status={status}
      icon={
        icon ?? (
          <StatusIcon size={48} strokeWidth={1.5} className="app-result__icon" aria-hidden="true" />
        )
      }
      {...props}
    />
  );
}
