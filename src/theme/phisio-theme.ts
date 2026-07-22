import { theme, type ThemeConfig } from 'antd';

import type { ThemeMode } from '@/theme/theme-mode';

interface PhisioPalette {
  primary: string;
  primaryHover: string;
  primarySoft: string;
  primaryMuted: string;
  accent: string;
  accentSoft: string;
  teal: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceHover: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderGlow: string;
}

interface PhisioShadows {
  sm: string;
  md: string;
  lg: string;
  card: string;
  glowPrimary: string;
  glowAccent: string;
}

/** Zivan dark — brand blue and green on deep navy (#0D1B2A) surfaces */
export const PHISIO_COLORS: PhisioPalette = {
  primary: '#3b82f6',
  primaryHover: '#60a5fa',
  primarySoft: 'rgba(59, 130, 246, 0.14)',
  primaryMuted: 'rgba(59, 130, 246, 0.28)',
  accent: '#22c55e',
  accentSoft: 'rgba(34, 197, 94, 0.16)',
  teal: '#2dd4bf',
  success: '#22c55e',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#38bdf8',
  background: '#0d1b2a',
  backgroundElevated: '#12233a',
  surface: '#1a2c44',
  surfaceHover: '#213650',
  surfaceElevated: '#16283f',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  border: 'rgba(148, 163, 184, 0.18)',
  borderGlow: 'rgba(59, 130, 246, 0.45)',
};

/** Zivan light — brand blue (#2563EB) on clean white surfaces */
export const PHISIO_LIGHT_COLORS: PhisioPalette = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primarySoft: 'rgba(37, 99, 235, 0.08)',
  primaryMuted: 'rgba(37, 99, 235, 0.2)',
  accent: '#16a34a',
  accentSoft: 'rgba(34, 197, 94, 0.12)',
  teal: '#0d9488',
  success: '#16a34a',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0284c7',
  background: '#ffffff',
  backgroundElevated: '#f8fafc',
  surface: '#f8fafc',
  surfaceHover: '#f1f5f9',
  surfaceElevated: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  border: '#e2e8f0',
  borderGlow: 'rgba(37, 99, 235, 0.35)',
};

export const PHISIO_SHADOWS: PhisioShadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.35)',
  md: '0 8px 24px rgba(0, 0, 0, 0.45)',
  lg: '0 16px 48px rgba(0, 0, 0, 0.55)',
  card: '0 4px 20px rgba(0, 0, 0, 0.4)',
  glowPrimary: '0 0 24px rgba(59, 130, 246, 0.25)',
  glowAccent: '0 0 24px rgba(34, 197, 94, 0.2)',
};

export const PHISIO_LIGHT_SHADOWS: PhisioShadows = {
  sm: '0 2px 8px rgba(15, 23, 42, 0.06)',
  md: '0 8px 24px rgba(15, 23, 42, 0.1)',
  lg: '0 16px 48px rgba(15, 23, 42, 0.14)',
  card: '0 4px 20px rgba(15, 23, 42, 0.07)',
  glowPrimary: '0 0 24px rgba(37, 99, 235, 0.14)',
  glowAccent: '0 0 24px rgba(34, 197, 94, 0.12)',
};

export function createPhisioTheme(mode: ThemeMode): ThemeConfig {
  const isDark = mode === 'dark';
  const c = isDark ? PHISIO_COLORS : PHISIO_LIGHT_COLORS;
  const s = isDark ? PHISIO_SHADOWS : PHISIO_LIGHT_SHADOWS;

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: c.primary,
      colorPrimaryHover: c.primaryHover,
      colorPrimaryBg: c.primarySoft,
      colorPrimaryBgHover: c.primaryMuted,
      colorSuccess: c.success,
      colorWarning: c.warning,
      colorError: c.error,
      colorInfo: c.info,
      colorText: c.text,
      colorTextSecondary: c.textSecondary,
      colorTextTertiary: c.textMuted,
      colorBgLayout: c.background,
      colorBgContainer: c.surface,
      colorBgElevated: c.surfaceElevated,
      colorBorder: c.border,
      colorBorderSecondary: c.border,
      borderRadius: 8,
      borderRadiusLG: 12,
      borderRadiusSM: 6,
      fontFamily: 'Vazirmatn, Tahoma, sans-serif',
      fontSize: 14,
      fontSizeHeading1: 26,
      fontSizeHeading2: 22,
      fontSizeHeading3: 18,
      fontSizeHeading4: 16,
      fontSizeHeading5: 14,
      lineHeight: 1.6,
      controlHeight: 36,
      controlHeightLG: 40,
      controlHeightSM: 28,
      boxShadow: s.md,
      boxShadowSecondary: s.sm,
      boxShadowTertiary: s.card,
      motionDurationMid: '0.22s',
    },
    components: {
      Layout: {
        headerBg: c.backgroundElevated,
        siderBg: c.backgroundElevated,
        bodyBg: c.background,
        headerHeight: 56,
        headerPadding: '0 16px',
      },
      Card: {
        borderRadiusLG: 12,
        paddingLG: 16,
        colorBgContainer: c.surface,
        colorBorderSecondary: c.border,
      },
      Button: {
        controlHeight: 36,
        controlHeightLG: 40,
        borderRadius: 8,
        borderRadiusLG: 10,
        primaryShadow: s.glowPrimary,
        fontWeight: 500,
      },
      Input: {
        controlHeight: 36,
        controlHeightLG: 40,
        borderRadius: 8,
        colorBgContainer: c.backgroundElevated,
        activeBorderColor: c.primary,
        hoverBorderColor: c.borderGlow,
        activeShadow: `0 0 0 3px ${c.primaryMuted}`,
      },
      Select: {
        controlHeight: 36,
        borderRadius: 8,
        colorBgContainer: c.backgroundElevated,
      },
      Form: {
        labelColor: c.text,
        labelFontSize: 13,
        itemMarginBottom: 16,
      },
      Menu: {
        itemHeight: 40,
        itemBorderRadius: 8,
        itemSelectedColor: c.primary,
        itemSelectedBg: c.primarySoft,
        itemHoverBg: c.primarySoft,
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
      },
      Table: {
        borderRadius: 8,
        headerBg: c.backgroundElevated,
        headerColor: c.text,
        headerSplitColor: 'transparent',
        rowHoverBg: c.primarySoft,
        colorBgContainer: c.surface,
      },
      Modal: {
        borderRadiusLG: 12,
        contentBg: c.surface,
        headerBg: c.surface,
      },
      Drawer: {
        borderRadiusLG: 12,
        colorBgElevated: c.backgroundElevated,
      },
      Segmented: {
        borderRadius: 8,
        itemSelectedBg: c.surface,
        itemSelectedColor: c.primary,
        trackBg: c.backgroundElevated,
      },
      Tag: {
        borderRadiusSM: 6,
      },
      Statistic: {
        titleFontSize: 12,
        contentFontSize: 26,
      },
      Progress: {
        defaultColor: c.primary,
        remainingColor: c.backgroundElevated,
      },
      Alert: {
        borderRadiusLG: 8,
      },
      Empty: {
        colorTextDescription: c.textSecondary,
      },
      Typography: {
        titleMarginBottom: 0,
        titleMarginTop: 0,
      },
      Radio: {
        buttonBg: c.backgroundElevated,
        buttonCheckedBg: c.primarySoft,
        buttonSolidCheckedBg: c.primary,
        borderRadius: 8,
      },
      Steps: {
        iconSize: 28,
      },
      Dropdown: {
        colorBgElevated: c.surface,
      },
    },
  };
}
