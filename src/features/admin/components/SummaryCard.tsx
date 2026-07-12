import { StatCard } from '@/components/ui/StatCard';
import { formatPersianNumber } from '@/utils/persian-format';

interface SummaryCardProps {
  label: string;
  value: number;
  to: string;
}

export function SummaryCard({ label, value, to }: SummaryCardProps) {
  return <StatCard label={label} value={formatPersianNumber(value)} to={to} />;
}
