import { ConfigProvider, Slider } from 'antd';
import { useTranslation } from 'react-i18next';

import { formatPersianNumber } from '@/utils/persian-format';

interface TactileSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  onChange?: (value: number) => void;
  className?: string;
  disabled?: boolean;
  showTicks?: boolean;
}

const TRACK_HEIGHT = 6;
const HANDLE_SIZE = 18;
const HANDLE_SIZE_HOVER = 20;

export function TactileSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  label,
  onChange,
  className = '',
  disabled = false,
  showTicks = false,
}: TactileSliderProps) {
  const { i18n } = useTranslation();
  const isFa = i18n.language.startsWith('fa');
  const formatValue = (n: number) => (isFa ? formatPersianNumber(n) : String(n));
  const displayValue = formatValue(value);
  const range = Math.max(max - min, 1);
  const percent = Math.min(100, Math.max(0, ((value - min) / range) * 100));
  const tickStep = range <= 10 ? 1 : range <= 20 ? 5 : 25;
  const ticks: number[] = [];
  if (showTicks || range >= 20) {
    for (let tick = min; tick <= max; tick += tickStep) {
      ticks.push(tick);
    }
    if (ticks[ticks.length - 1] !== max) {
      ticks.push(max);
    }
  }

  return (
    <div
      className={['tactile-slider', className].filter(Boolean).join(' ')}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {label ? (
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--phisio-text)',
          }}
        >
          {label}
        </span>
      ) : null}

      <div style={{ position: 'relative', paddingTop: 28, paddingInline: 4 }}>
        <div
          className="tactile-slider__value-badge"
          style={{
            position: 'absolute',
            top: 0,
            insetInlineStart: `calc(${percent}% - 18px)`,
            minWidth: 36,
            padding: '2px 8px',
            fontSize: '12px',
            fontWeight: 700,
            textAlign: 'center',
            color: 'var(--phisio-primary)',
            backgroundColor: 'var(--phisio-primary-soft)',
            borderRadius: 'var(--phisio-radius-pill)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {displayValue}
          {unit ? ` ${unit}` : ''}
        </div>

        <ConfigProvider
          theme={{
            components: {
              Slider: {
                railSize: TRACK_HEIGHT,
                handleSize: HANDLE_SIZE,
                handleSizeHover: HANDLE_SIZE_HOVER,
                handleColor: 'var(--phisio-primary)',
                handleColorDisabled: 'var(--phisio-border)',
                railBg: 'var(--phisio-bg-elevated)',
                railHoverBg: 'var(--phisio-bg-elevated)',
              },
            },
          }}
        >
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            disabled={disabled}
            tooltip={{ open: false }}
            styles={{
              track: {
                background: 'var(--phisio-brand-gradient)',
              },
            }}
          />
        </ConfigProvider>

        {ticks.length > 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 2,
              paddingInline: 2,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--phisio-text-secondary)',
            }}
          >
            {ticks.map((tick) => (
              <span key={tick}>{formatValue(tick)}</span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
