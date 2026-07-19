import { theme, type ThemeConfig } from 'antd';

import type { ThemeMode } from '@/theme/theme-mode';

interface PhisioPalette {
  primary: string;
  primaryHover: string;
  primarySoft: string;
  primaryMuted: string;
  coral: string;
  coralSoft: string;
  mint: string;
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
  glowTeal: string;
  glowCoral: string;
}

/** Energetic Dark — bold rehab coach on deep navy surfaces */
export const PHISIO_COLORS: PhisioPalette = {
  primary: '#2dd4bf',
  primaryHover: '#14b8a6',
  primarySoft: 'rgba(45, 212, 191, 0.12)',
  primaryMuted: 'rgba(45, 212, 191, 0.24)',
  coral: '#f97316',
  coralSoft: 'rgba(249, 115, 22, 0.16)',
  mint: '#a7f3d0',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#38bdf8',
  background: '#0b1220',
  backgroundElevated: '#111827',
  surface: '#1e293b',
  surfaceHover: '#243044',
  surfaceElevated: '#1a2332',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  border: 'rgba(148, 163, 184, 0.18)',
  borderGlow: 'rgba(45, 212, 191, 0.45)',
};

/** Light theme — same brand teal on clean white surfaces */
export const PHISIO_LIGHT_COLORS: PhisioPalette = {
  primary: '#0d9488',
  primaryHover: '#0f766e',
  primarySoft: 'rgba(13, 148, 136, 0.1)',
  primaryMuted: 'rgba(13, 148, 136, 0.22)',
  coral: '#ea580c',
  coralSoft: 'rgba(234, 88, 12, 0.12)',
  mint: '#059669',
  success: '#059669',
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
  borderGlow: 'rgba(13, 148, 136, 0.4)',
};

export const PHISIO_SHADOWS: PhisioShadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.35)',
  md: '0 8px 24px rgba(0, 0, 0, 0.45)',
  lg: '0 16px 48px rgba(0, 0, 0, 0.55)',
  card: '0 4px 20px rgba(0, 0, 0, 0.4)',
  glowTeal: '0 0 24px rgba(45, 212, 191, 0.25)',
  glowCoral: '0 0 24px rgba(249, 115, 22, 0.22)',
};

export const PHISIO_LIGHT_SHADOWS: PhisioShadows = {
  sm: '0 2px 8px rgba(15, 23, 42, 0.06)',
  md: '0 8px 24px rgba(15, 23, 42, 0.1)',
  lg: '0 16px 48px rgba(15, 23, 42, 0.14)',
  card: '0 4px 20px rgba(15, 23, 42, 0.07)',
  glowTeal: '0 0 24px rgba(13, 148, 136, 0.14)',
  glowCoral: '0 0 24px rgba(234, 88, 12, 0.12)',
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
      borderRadius: 14,
      borderRadiusLG: 18,
      borderRadiusSM: 10,
      fontFamily: 'IRANSans, Tahoma, sans-serif',
      fontSize: 15,
      fontSizeHeading1: 30,
      fontSizeHeading2: 24,
      fontSizeHeading3: 20,
      fontSizeHeading4: 17,
      fontSizeHeading5: 15,
      lineHeight: 1.6,
      controlHeight: 46,
      controlHeightLG: 50,
      controlHeightSM: 38,
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
        headerHeight: 64,
        headerPadding: '0 20px',
      },
      Card: {
        borderRadiusLG: 18,
        paddingLG: 22,
        colorBgContainer: c.surface,
        colorBorderSecondary: c.border,
      },
      Button: {
        controlHeight: 46,
        controlHeightLG: 50,
        borderRadius: 14,
        borderRadiusLG: 16,
        primaryShadow: s.glowTeal,
        fontWeight: 600,
      },
      Input: {
        controlHeight: 46,
        controlHeightLG: 50,
        borderRadius: 14,
        colorBgContainer: c.backgroundElevated,
        activeBorderColor: c.primary,
        hoverBorderColor: c.borderGlow,
        activeShadow: `0 0 0 3px ${c.primaryMuted}`,
      },
      Select: {
        controlHeight: 46,
        borderRadius: 14,
        colorBgContainer: c.backgroundElevated,
      },
      Form: {
        labelColor: c.text,
        labelFontSize: 14,
        itemMarginBottom: 20,
      },
      Menu: {
        itemHeight: 48,
        itemBorderRadius: 12,
        itemSelectedColor: c.primary,
        itemSelectedBg: c.primarySoft,
        itemHoverBg: c.primarySoft,
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
      },
      Table: {
        borderRadius: 14,
        headerBg: c.backgroundElevated,
        headerColor: c.text,
        headerSplitColor: 'transparent',
        rowHoverBg: c.primarySoft,
        colorBgContainer: c.surface,
      },
      Modal: {
        borderRadiusLG: 18,
        contentBg: c.surface,
        headerBg: c.surface,
      },
      Drawer: {
        borderRadiusLG: 18,
        colorBgElevated: c.backgroundElevated,
      },
      Segmented: {
        borderRadius: 12,
        itemSelectedBg: c.surface,
        itemSelectedColor: c.primary,
        trackBg: c.backgroundElevated,
      },
      Tag: {
        borderRadiusSM: 8,
      },
      Statistic: {
        titleFontSize: 13,
        contentFontSize: 30,
      },
      Progress: {
        defaultColor: c.primary,
        remainingColor: c.backgroundElevated,
      },
      Alert: {
        borderRadiusLG: 14,
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
        borderRadius: 12,
      },
      Steps: {
        iconSize: 30,
      },
      Dropdown: {
        colorBgElevated: c.surface,
      },
    },
  };
}
