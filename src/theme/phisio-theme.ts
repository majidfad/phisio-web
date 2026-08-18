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

/** Kit radius scale (px) — keep in sync with --phisio-radius-* */
const R = {
  sm: 10,
  md: 14,
  card: 16,
  lg: 20,
  xl: 28,
} as const;

/** Kit control heights — keep in sync with --phisio-control-height-* */
const H = {
  sm: 36,
  md: 44,
  lg: 48,
} as const;

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
  surfaceElevated: '#1c2a3d',
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
  surfaceElevated: '#eef1f4',
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
      colorPrimaryActive: c.primaryHover,
      colorPrimaryBg: c.primarySoft,
      colorPrimaryBgHover: c.primaryMuted,
      colorSuccess: c.success,
      colorSuccessBg: c.accentSoft,
      colorSuccessBorder: c.success,
      colorWarning: c.warning,
      colorWarningBg: isDark ? 'rgba(251, 191, 36, 0.12)' : 'rgba(217, 119, 6, 0.1)',
      colorWarningBorder: c.warning,
      colorError: c.error,
      colorErrorBg: isDark ? 'rgba(248, 113, 113, 0.12)' : 'rgba(220, 38, 38, 0.08)',
      colorErrorBorder: c.error,
      colorInfo: c.primary,
      colorInfoBg: c.primarySoft,
      colorInfoBorder: c.primary,
      colorLink: c.primary,
      colorLinkHover: c.primaryHover,
      colorLinkActive: c.primaryHover,
      colorText: c.text,
      colorTextSecondary: c.textSecondary,
      colorTextTertiary: c.textMuted,
      colorTextQuaternary: c.textMuted,
      colorBgLayout: c.background,
      colorBgContainer: c.surface,
      colorBgElevated: c.surface,
      colorBgSpotlight: c.backgroundElevated,
      colorFill: c.backgroundElevated,
      colorFillSecondary: c.backgroundElevated,
      colorFillTertiary: c.surfaceHover,
      colorFillQuaternary: c.primarySoft,
      colorBorder: c.border,
      colorBorderSecondary: c.border,
      borderRadius: R.md,
      borderRadiusLG: R.lg,
      borderRadiusSM: R.sm,
      borderRadiusXS: 8,
      fontFamily: 'Vazirmatn, Inter, system-ui, sans-serif',
      fontSize: 14,
      fontSizeSM: 12,
      fontSizeLG: 16,
      fontSizeHeading1: 28,
      fontSizeHeading2: 22,
      fontSizeHeading3: 18,
      fontSizeHeading4: 16,
      fontSizeHeading5: 15,
      lineHeight: 1.55,
      lineHeightHeading1: 1.3,
      lineHeightHeading2: 1.35,
      lineHeightHeading3: 1.4,
      controlHeight: H.md,
      controlHeightLG: H.lg,
      controlHeightSM: H.sm,
      boxShadow: s.md,
      boxShadowSecondary: s.sm,
      boxShadowTertiary: s.card,
      motionDurationMid: '0.2s',
      motionDurationFast: '0.15s',
    },
    components: {
      Layout: {
        headerBg: c.surface,
        siderBg: c.surface,
        bodyBg: c.background,
        triggerBg: c.backgroundElevated,
        triggerColor: c.text,
        headerHeight: 64,
        headerPadding: '0 16px',
      },
      Card: {
        borderRadiusLG: R.card,
        paddingLG: 16,
        colorBgContainer: c.surface,
        colorBorderSecondary: c.border,
      },
      Button: {
        controlHeight: H.md,
        controlHeightLG: H.lg,
        controlHeightSM: H.sm,
        borderRadius: R.md,
        borderRadiusLG: R.md,
        borderRadiusSM: R.sm,
        primaryShadow: 'none',
        dangerShadow: 'none',
        defaultShadow: 'none',
        fontWeight: 600,
        colorPrimary: c.primary,
        defaultBorderColor: c.border,
        defaultColor: c.text,
        defaultBg: c.backgroundElevated,
        defaultHoverBorderColor: c.primary,
        defaultHoverColor: c.primary,
        defaultHoverBg: c.surfaceHover,
      },
      Input: {
        controlHeight: H.md,
        controlHeightLG: H.lg,
        controlHeightSM: H.sm,
        borderRadius: R.md,
        colorBgContainer: c.backgroundElevated,
        activeBorderColor: c.primary,
        hoverBorderColor: c.primary,
        activeShadow: `0 0 0 2px ${c.primaryMuted}`,
        colorTextPlaceholder: c.textMuted,
      },
      InputNumber: {
        controlHeight: H.md,
        borderRadius: R.md,
        activeBorderColor: c.primary,
        hoverBorderColor: c.primary,
        activeShadow: `0 0 0 2px ${c.primaryMuted}`,
      },
      Select: {
        controlHeight: H.md,
        borderRadius: R.md,
        colorBgContainer: c.backgroundElevated,
        optionSelectedBg: c.primarySoft,
        optionActiveBg: c.primarySoft,
        optionSelectedColor: c.primary,
      },
      DatePicker: {
        controlHeight: H.md,
        borderRadius: R.md,
        colorBgContainer: c.backgroundElevated,
        activeBorderColor: c.primary,
        hoverBorderColor: c.primary,
        activeShadow: `0 0 0 2px ${c.primaryMuted}`,
      },
      Form: {
        labelColor: c.text,
        labelFontSize: 13,
        itemMarginBottom: 16,
      },
      Menu: {
        itemHeight: 40,
        itemBorderRadius: R.sm,
        itemSelectedColor: c.primary,
        itemSelectedBg: c.primarySoft,
        itemHoverBg: c.primarySoft,
        itemHoverColor: c.primary,
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
        activeBarBorderWidth: 0,
      },
      Table: {
        borderRadius: R.md,
        headerBg: c.backgroundElevated,
        headerColor: c.textSecondary,
        headerSplitColor: 'transparent',
        rowHoverBg: c.primarySoft,
        colorBgContainer: c.surface,
        cellPaddingBlock: 10,
        cellPaddingInline: 12,
        fontWeightStrong: 700,
      },
      Modal: {
        borderRadiusLG: R.xl,
        contentBg: c.surface,
        headerBg: 'transparent',
        titleFontSize: 15,
        titleColor: c.text,
      },
      Drawer: {
        borderRadiusLG: R.md,
        colorBgElevated: c.surface,
      },
      Segmented: {
        borderRadius: R.sm,
        itemSelectedBg: c.surface,
        itemSelectedColor: c.primary,
        trackBg: c.backgroundElevated,
      },
      Tag: {
        borderRadiusSM: R.sm,
        defaultBg: c.backgroundElevated,
        defaultColor: c.textSecondary,
      },
      Statistic: {
        titleFontSize: 12,
        contentFontSize: 24,
      },
      Progress: {
        defaultColor: c.teal,
        remainingColor: c.backgroundElevated,
        circleTextColor: c.text,
      },
      Slider: {
        trackBg: c.primary,
        trackHoverBg: c.primaryHover,
        railBg: c.backgroundElevated,
        handleColor: c.primary,
        handleActiveColor: c.primaryHover,
        dotBorderColor: c.border,
        colorPrimaryBorder: c.primary,
      },
      Switch: {
        colorPrimary: c.primary,
        colorPrimaryHover: c.primaryHover,
      },
      Checkbox: {
        borderRadiusSM: 6,
        colorPrimary: c.primary,
      },
      Radio: {
        buttonBg: c.backgroundElevated,
        buttonCheckedBg: c.primarySoft,
        buttonSolidCheckedBg: c.primary,
        buttonSolidCheckedColor: '#fff',
        borderRadius: R.sm,
        colorPrimary: c.primary,
      },
      Tabs: {
        itemSelectedColor: c.primary,
        itemHoverColor: c.primaryHover,
        inkBarColor: c.primary,
        itemColor: c.textSecondary,
        titleFontSize: 14,
      },
      Pagination: {
        borderRadius: R.sm,
        itemActiveBg: c.primarySoft,
        colorPrimary: c.primary,
      },
      Tooltip: {
        borderRadius: R.sm,
        colorBgSpotlight: isDark ? c.backgroundElevated : c.text,
      },
      Popover: {
        borderRadiusLG: R.card,
        colorBgElevated: c.surface,
      },
      Dropdown: {
        borderRadiusLG: R.card,
        colorBgElevated: c.surface,
        paddingBlock: 6,
      },
      Alert: {
        borderRadiusLG: R.md,
        colorSuccessBg: c.surface,
        colorSuccessBorder: c.success,
        colorInfoBg: c.surface,
        colorInfoBorder: c.primary,
        colorWarningBg: c.surface,
        colorWarningBorder: c.warning,
        colorErrorBg: c.surface,
        colorErrorBorder: c.error,
      },
      Message: {
        contentBg: c.surface,
        borderRadiusLG: R.card,
      },
      Notification: {
        width: 384,
        colorBgElevated: c.surface,
      },
      Badge: {
        colorError: c.error,
        colorSuccess: c.success,
        colorWarning: c.warning,
        colorPrimary: c.primary,
      },
      Empty: {
        colorTextDescription: c.textSecondary,
      },
      Typography: {
        titleMarginBottom: 0,
        titleMarginTop: 0,
        colorText: c.text,
        colorTextSecondary: c.textSecondary,
        colorLink: c.primary,
        colorLinkHover: c.primaryHover,
      },
      Steps: {
        iconSize: 28,
        colorPrimary: c.primary,
      },
      Spin: {
        colorPrimary: c.primary,
      },
      Skeleton: {
        gradientFromColor: c.backgroundElevated,
        gradientToColor: c.surfaceHover,
      },
    },
  };
}
