import { Slider } from 'antd';

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
}

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
}: TactileSliderProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
        <div
          style={{
            padding: '2px 8px',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--phisio-primary)',
            backgroundColor: 'var(--phisio-primary-soft)',
            borderRadius: 'var(--phisio-radius-sm)',
          }}
        >
          {value} {unit}
        </div>
      </div>
      <div style={{ padding: '0 4px' }}>
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
              height: 6,
              borderRadius: 3,
            },
            rail: {
              background: 'var(--phisio-bg-elevated)',
              height: 6,
              borderRadius: 3,
            },
            handle: {
              borderColor: 'var(--phisio-primary)',
              backgroundColor: 'var(--phisio-surface)',
              width: 18,
              height: 18,
              marginTop: -6,
              boxShadow: 'var(--phisio-shadow-sm)',
            },
          }}
        />
      </div>
    </div>
  );
}
