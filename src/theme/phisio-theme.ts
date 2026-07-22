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

/** Zivan dark — logo cobalt + seafoam on deep navy surfaces */
export const PHISIO_COLORS: PhisioPalette = {
  primary: '#2e5bcc',
  primaryHover: '#4a74d9',
  primarySoft: 'rgba(46, 91, 204, 0.16)',
  primaryMuted: 'rgba(46, 91, 204, 0.28)',
  accent: '#48c9b0',
  accentSoft: 'rgba(72, 201, 176, 0.16)',
  teal: '#48c9b0',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#3498db',
  background: '#0d1b2a',
  backgroundElevated: '#12233a',
  surface: '#1a2c44',
  surfaceHover: '#213650',
  surfaceElevated: '#16283f',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  border: 'rgba(148, 163, 184, 0.18)',
  borderGlow: 'rgba(46, 91, 204, 0.4)',
};

/** Zivan light — logo cobalt on clean white surfaces */
export const PHISIO_LIGHT_COLORS: PhisioPalette = {
  primary: '#2e5bcc',
  primaryHover: '#2548a8',
  primarySoft: 'rgba(46, 91, 204, 0.08)',
  primaryMuted: 'rgba(46, 91, 204, 0.2)',
  accent: '#2aa891',
  accentSoft: 'rgba(42, 168, 145, 0.12)',
  teal: '#2aa891',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0284c7',
  background: '#ffffff',
  backgroundElevated: '#f8fafc',
  surface: '#ffffff',
  surfaceHover: '#f1f5f9',
  surfaceElevated: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  border: '#e2e8f0',
  borderGlow: 'rgba(46, 91, 204, 0.35)',
};

export const PHISIO_SHADOWS: PhisioShadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.28)',
  md: '0 6px 16px rgba(0, 0, 0, 0.32)',
  lg: '0 12px 32px rgba(0, 0, 0, 0.4)',
  card: '0 2px 8px rgba(0, 0, 0, 0.28)',
  glowPrimary: 'none',
  glowAccent: 'none',
};

export const PHISIO_LIGHT_SHADOWS: PhisioShadows = {
  sm: '0 1px 2px rgba(15, 23, 42, 0.05)',
  md: '0 6px 16px rgba(15, 23, 42, 0.08)',
  lg: '0 12px 32px rgba(15, 23, 42, 0.12)',
  card: '0 1px 3px rgba(15, 23, 42, 0.06)',
  glowPrimary: 'none',
  glowAccent: 'none',
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
      colorSuccessBg: c.surface,
      colorSuccessBorder: c.border,
      colorWarning: c.warning,
      colorError: c.error,
      colorInfo: c.primary,
      colorInfoBg: c.surface,
      colorInfoBorder: c.border,
      colorText: c.text,
      colorTextSecondary: c.textSecondary,
      colorTextTertiary: c.textMuted,
      colorBgLayout: c.background,
      colorBgContainer: c.surface,
      colorBgElevated: c.surfaceElevated,
      colorBorder: c.border,
      colorBorderSecondary: c.border,
      borderRadius: 10,
      borderRadiusLG: 14,
      borderRadiusSM: 8,
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
        borderRadiusLG: 14,
        paddingLG: 16,
        colorBgContainer: c.surface,
        colorBorderSecondary: c.border,
      },
      Button: {
        controlHeight: 36,
        controlHeightLG: 40,
        borderRadius: 10,
        borderRadiusLG: 12,
        primaryShadow: 'none',
        fontWeight: 600,
        colorPrimary: c.primary,
        defaultBorderColor: c.border,
        defaultColor: c.text,
      },
      Input: {
        controlHeight: 36,
        controlHeightLG: 40,
        borderRadius: 10,
        colorBgContainer: c.backgroundElevated,
        activeBorderColor: c.primary,
        hoverBorderColor: c.primary,
        activeShadow: `0 0 0 2px ${c.primaryMuted}`,
      },
      Select: {
        controlHeight: 36,
        borderRadius: 10,
        colorBgContainer: c.backgroundElevated,
      },
      Form: {
        labelColor: c.text,
        labelFontSize: 13,
        itemMarginBottom: 16,
      },
      Menu: {
        itemHeight: 40,
        itemBorderRadius: 10,
        itemSelectedColor: c.primary,
        itemSelectedBg: c.primarySoft,
        itemHoverBg: c.primarySoft,
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
      },
      Table: {
        borderRadius: 10,
        headerBg: c.backgroundElevated,
        headerColor: c.text,
        headerSplitColor: 'transparent',
        rowHoverBg: c.primarySoft,
        colorBgContainer: c.surface,
      },
      Modal: {
        borderRadiusLG: 14,
        contentBg: c.surface,
        headerBg: c.surface,
      },
      Drawer: {
        borderRadiusLG: 14,
        colorBgElevated: c.backgroundElevated,
      },
      Segmented: {
        borderRadius: 10,
        itemSelectedBg: c.surface,
        itemSelectedColor: c.primary,
        trackBg: c.backgroundElevated,
      },
      Tag: {
        borderRadiusSM: 8,
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
        borderRadiusLG: 10,
        colorSuccessBg: c.surface,
        colorInfoBg: c.surface,
        colorWarningBg: c.surface,
        colorErrorBg: c.surface,
      },
      Message: {
        contentBg: c.surface,
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
        borderRadius: 10,
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
