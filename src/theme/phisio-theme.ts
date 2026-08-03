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

/** Modern patient kit dark — primary blue + teal progress on navy surfaces */
export const PHISIO_COLORS: PhisioPalette = {
  primary: '#3b9afa',
  primaryHover: '#5aadff',
  primarySoft: 'rgba(59, 154, 250, 0.14)',
  primaryMuted: 'rgba(59, 154, 250, 0.26)',
  accent: '#2dd4b0',
  accentSoft: 'rgba(45, 212, 176, 0.14)',
  teal: '#2dd4b0',
  success: '#2dd4b0',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#3b9afa',
  background: '#0b1220',
  backgroundElevated: '#1c2a3d',
  surface: '#152033',
  surfaceHover: '#1a2740',
  surfaceElevated: '#1a2740',
  text: '#f3f5f7',
  textSecondary: '#9aa6b2',
  textMuted: '#7a869a',
  border: '#243247',
  borderGlow: 'rgba(59, 154, 250, 0.35)',
};

/** Modern patient kit light — #0B7AEA + teal progress on cool gray canvas */
export const PHISIO_LIGHT_COLORS: PhisioPalette = {
  primary: '#0b7aea',
  primaryHover: '#0969d0',
  primarySoft: 'rgba(11, 122, 234, 0.1)',
  primaryMuted: 'rgba(11, 122, 234, 0.2)',
  accent: '#0f9f8a',
  accentSoft: 'rgba(15, 159, 138, 0.12)',
  teal: '#0f9f8a',
  success: '#0f9f8a',
  warning: '#d97706',
  error: '#dc2626',
  info: '#0b7aea',
  background: '#f6f8fa',
  backgroundElevated: '#eef1f4',
  surface: '#ffffff',
  surfaceHover: '#f0f3f6',
  surfaceElevated: '#f0f3f6',
  text: '#0b1f33',
  textSecondary: '#5b6b7c',
  textMuted: '#8993a4',
  border: '#e2e6eb',
  borderGlow: 'rgba(11, 122, 234, 0.28)',
};

export const PHISIO_SHADOWS: PhisioShadows = {
  sm: '0 2px 6px rgba(0, 0, 0, 0.28)',
  md: '0 10px 28px -4px rgba(0, 0, 0, 0.4)',
  lg: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
  card: '0 8px 22px -4px rgba(0, 0, 0, 0.34)',
  glowPrimary: 'none',
  glowAccent: 'none',
};

export const PHISIO_LIGHT_SHADOWS: PhisioShadows = {
  sm: '0 1px 3px rgba(11, 31, 51, 0.05), 0 1px 2px rgba(11, 31, 51, 0.04)',
  md: '0 10px 28px -6px rgba(11, 31, 51, 0.1), 0 4px 10px rgba(11, 31, 51, 0.04)',
  lg: '0 18px 36px -10px rgba(11, 31, 51, 0.14)',
  card: '0 6px 18px -4px rgba(11, 31, 51, 0.08), 0 2px 6px rgba(11, 31, 51, 0.04)',
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
      borderRadius: 14,
      borderRadiusLG: 20,
      borderRadiusSM: 10,
      fontFamily: 'Vazirmatn, Inter, system-ui, sans-serif',
      fontSize: 14,
      fontSizeHeading1: 28,
      fontSizeHeading2: 22,
      fontSizeHeading3: 18,
      fontSizeHeading4: 16,
      fontSizeHeading5: 15,
      lineHeight: 1.6,
      controlHeight: 44,
      controlHeightLG: 48,
      controlHeightSM: 36,
      boxShadow: s.md,
      boxShadowSecondary: s.sm,
      boxShadowTertiary: s.card,
      motionDurationMid: '0.22s',
    },
    components: {
      Layout: {
        headerBg: c.surface,
        siderBg: c.surface,
        bodyBg: c.background,
        headerHeight: 64,
        headerPadding: '0 16px',
      },
      Card: {
        borderRadiusLG: 16,
        paddingLG: 16,
        colorBgContainer: c.surface,
        colorBorderSecondary: c.border,
      },
      Button: {
        controlHeight: 44,
        controlHeightLG: 48,
        borderRadius: 14,
        borderRadiusLG: 999,
        primaryShadow: 'none',
        fontWeight: 600,
        colorPrimary: c.primary,
        defaultBorderColor: c.border,
        defaultColor: c.text,
      },
      Input: {
        controlHeight: 44,
        controlHeightLG: 48,
        borderRadius: 14,
        colorBgContainer: c.backgroundElevated,
        activeBorderColor: c.primary,
        hoverBorderColor: c.primary,
        activeShadow: `0 0 0 2px ${c.primaryMuted}`,
      },
      Select: {
        controlHeight: 44,
        borderRadius: 14,
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
        borderRadiusLG: 28,
        contentBg: c.surface,
        headerBg: 'transparent',
        titleFontSize: 15,
      },
      Drawer: {
        borderRadiusLG: 14,
        colorBgElevated: c.surface,
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
