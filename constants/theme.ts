import { Platform } from 'react-native';
interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

interface ColorTokens {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  background: string;
  backgroundSecondary: string;
  backgroundElevated: string;
  border: string;
  borderFocus: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  tabIconDefault: string;
  tabIconSelected: string;
  icon: string;
}

interface RaffleColors {
  ticket: {
    available: string;
    sold: string;
    winning: string;
    selected: string;
  };
  status: {
    active: string;
    completed: string;
    cancelled: string;
    pending: string;
  };
}

interface FontSizes {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
}

interface FontWeights {
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
  extrabold: string;
}

interface LineHeights {
  tight: number;
  normal: number;
  relaxed: number;
}

interface FontFamilies {
  sans: string;
  serif: string;
  rounded: string;
  mono: string;
  display?: string;
}

interface PrincipalColors {
  red: ColorScale;
  yellow: ColorScale;
  neutral: ColorScale;
}

interface ColorsStructure {
  light: ColorTokens & {
    text: string;
    background: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
  };
  dark: ColorTokens & {
    text: string;
    background: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
  };
  principal: PrincipalColors;
  raffle: RaffleColors;
}

interface TypographyStructure {
  fonts: FontFamilies;
  sizes: FontSizes;
  weights: FontWeights;
  lineHeights: LineHeights;
}

type FontSizeKey = keyof FontSizes;
type FontWeightKey = keyof FontWeights;
type FontFamilyKey = keyof FontFamilies;
type ThemeMode = 'light' | 'dark';

const PRIMARY_COLORS: PrincipalColors = {
  red: {
    50: '#FFF5F7',
    100: '#FED7E2',
    200: '#FBB6CE',
    300: '#F687B3',
    400: '#ED64A6',
    500: '#D52941',   
    600: '#B83280',
    700: '#97266D',
    800: '#702459',
    900: '#990D35',
  },
  yellow: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD581',    
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  }
};

const COLOR_TOKENS: { light: ColorTokens; dark: ColorTokens } = {
  light: {
    primary: PRIMARY_COLORS.red[500],
    primaryDark: PRIMARY_COLORS.red[600],
    secondary: PRIMARY_COLORS.yellow[300],
    secondaryLight: '#FFF8E8',

    text: PRIMARY_COLORS.neutral[900],
    textSecondary: PRIMARY_COLORS.neutral[600],
    textMuted: PRIMARY_COLORS.neutral[500],

    background: '#FFFFFF',
    backgroundSecondary: PRIMARY_COLORS.neutral[50],
    backgroundElevated: '#FFFFFF',

    border: PRIMARY_COLORS.neutral[200],
    borderFocus: PRIMARY_COLORS.red[500],

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    tabIconDefault: PRIMARY_COLORS.neutral[400],
    tabIconSelected: PRIMARY_COLORS.red[500],
    icon: PRIMARY_COLORS.neutral[500],
  },
  dark: {
    primary: PRIMARY_COLORS.red[400],
    primaryDark: PRIMARY_COLORS.red[300],
    secondary: PRIMARY_COLORS.yellow[300],
    secondaryLight: '#2D2A21', 

    text: PRIMARY_COLORS.neutral[50],
    textSecondary: PRIMARY_COLORS.neutral[300],
    textMuted: PRIMARY_COLORS.neutral[400],

    background: PRIMARY_COLORS.neutral[900],
    backgroundSecondary: PRIMARY_COLORS.neutral[800],
    backgroundElevated: PRIMARY_COLORS.neutral[800],

    border: PRIMARY_COLORS.neutral[700],
    borderFocus: PRIMARY_COLORS.red[400],

    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',

    tabIconDefault: PRIMARY_COLORS.neutral[400],
    tabIconSelected: PRIMARY_COLORS.red[400],
    icon: PRIMARY_COLORS.neutral[400],
  }
};

const RAFFLE_COLORS: RaffleColors = {
  ticket: {
    available: COLOR_TOKENS.light.success,
    sold: COLOR_TOKENS.light.error,
    winning: COLOR_TOKENS.light.warning,
    selected: COLOR_TOKENS.light.primary
  },
  status: {
    active: COLOR_TOKENS.light.success,
    completed: COLOR_TOKENS.light.textMuted,
    cancelled: COLOR_TOKENS.light.error,
    pending: COLOR_TOKENS.light.warning
  }
};

const FONT_SIZES: FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

const FONT_WEIGHTS: FontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

const LINE_HEIGHTS: LineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors: ColorsStructure = {
  light: {
    ...COLOR_TOKENS.light,
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    ...COLOR_TOKENS.dark,
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  principal: {
    red: PRIMARY_COLORS.red,
    yellow: PRIMARY_COLORS.yellow,
    neutral: PRIMARY_COLORS.neutral,
  },
  raffle: RAFFLE_COLORS
};

export const FONT_FAMILIES: FontFamilies = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
}) as FontFamilies;

export const Typography: TypographyStructure = {
  fonts: FONT_FAMILIES,
  sizes: FONT_SIZES,
  weights: FONT_WEIGHTS,
  lineHeights: LINE_HEIGHTS,
};

export const getColor = (colorPath: string, theme: ThemeMode = 'light'): string | null => {
  const path = colorPath.split('.');
  let result: any = Colors[theme];
  
  for (const key of path) {
    result = result?.[key];
    if (result === undefined) return null;
  }
  
  return result;
};

interface TextStyle {
  fontFamily: string | any;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
}

export const createTextStyle = (
  size: FontSizeKey = 'base', 
  weight: FontWeightKey = 'normal', 
  family: FontFamilyKey = 'sans'
): TextStyle => ({
  fontFamily: Typography.fonts[family],
  fontSize: Typography.sizes[size],
  fontWeight: Typography.weights[weight],
  lineHeight: Typography.lineHeights.normal,
});

export default {
  Colors,
  Typography,
  getColor,
  createTextStyle,
};