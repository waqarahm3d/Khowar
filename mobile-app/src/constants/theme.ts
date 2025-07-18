import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Pakistani Cultural Colors
export const PAKISTANI_COLORS = {
  // Primary Colors (Pakistan Flag)
  primary: '#01411C',      // Pakistan Green
  secondary: '#FFFFFF',    // White
  
  // Cultural Accent Colors
  saffron: '#FF9933',      // Traditional Saffron
  gold: '#FFD700',         // Gold accent
  deepBlue: '#1E3A8A',     // Trust & Stability
  
  // Theme Variations
  primaryLight: '#2D5A3D',
  primaryDark: '#001A0A',
  
  // Functional Colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  textLight: '#ADB5BD',
  
  // Status Colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Music Player Colors
  playerBackground: '#000000',
  playerText: '#FFFFFF',
  progressBar: '#FF9933',
  progressBackground: '#333333',
  
  // Cultural Theme Colors
  qawwali: '#8B4513',      // Brown for Qawwali
  sufi: '#800080',         // Purple for Sufi
  folk: '#228B22',         // Forest Green for Folk
  classical: '#4B0082',    // Indigo for Classical
  
  // Festival Colors
  eid: '#FFD700',          // Gold for Eid
  basant: '#FFFF00',       // Yellow for Basant
  wedding: '#FF69B4',      // Pink for Wedding
  
  // Gradient Colors
  gradientStart: '#01411C',
  gradientEnd: '#2D5A3D',
  
  // Shadow Colors
  shadow: '#000000',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.2)',
  shadowDark: 'rgba(0, 0, 0, 0.3)',
};

// Typography
export const FONTS = {
  // Urdu Fonts
  urdu: {
    regular: 'NotoNastaliqUrdu-Regular',
    bold: 'NotoNastaliqUrdu-Bold',
  },
  
  // English Fonts
  english: {
    thin: 'Inter-Thin',
    light: 'Inter-Light',
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    extraBold: 'Inter-ExtraBold',
  },
  
  // Arabic Fonts (for decorative elements)
  arabic: {
    regular: 'Amiri-Regular',
    bold: 'Amiri-Bold',
  },
};

// Font Sizes
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  
  // Headings
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  
  // Urdu Text (typically larger)
  urduSm: 14,
  urduMd: 16,
  urduLg: 18,
  urduXl: 20,
  urduXxl: 24,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Padding
  paddingXs: 4,
  paddingSm: 8,
  paddingMd: 12,
  paddingLg: 16,
  paddingXl: 20,
  paddingXxl: 24,
  
  // Margins
  marginXs: 4,
  marginSm: 8,
  marginMd: 12,
  marginLg: 16,
  marginXl: 20,
  marginXxl: 24,
};

// Border Radius
export const BORDER_RADIUS = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
  
  // Cultural Elements
  islamicPattern: 12,  // Common in Islamic geometric patterns
  mughalArch: 16,      // Inspired by Mughal architecture
};

// Dimensions
export const DIMENSIONS = {
  width,
  height,
  
  // Common dimensions
  headerHeight: 60,
  tabBarHeight: 60,
  playerHeight: 80,
  
  // Screen padding
  screenPadding: 16,
  
  // Card dimensions
  cardMinHeight: 120,
  cardMaxHeight: 200,
  
  // Button dimensions
  buttonHeight: 48,
  buttonHeightSm: 36,
  buttonHeightLg: 56,
  
  // Input dimensions
  inputHeight: 48,
  
  // Icon sizes
  iconXs: 12,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 32,
  iconXxl: 48,
};

// Shadows
export const SHADOWS = {
  light: {
    shadowColor: PAKISTANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  medium: {
    shadowColor: PAKISTANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  
  heavy: {
    shadowColor: PAKISTANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Cultural shadow (inspired by traditional art)
  cultural: {
    shadowColor: PAKISTANI_COLORS.saffron,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// Cultural Patterns (for decorative elements)
export const CULTURAL_PATTERNS = {
  // Islamic geometric patterns
  islamic: {
    primary: '#01411C',
    secondary: '#FF9933',
    accent: '#FFD700',
  },
  
  // Truck art inspired patterns
  truckArt: {
    primary: '#FF0000',
    secondary: '#00FF00',
    accent: '#0000FF',
    gold: '#FFD700',
  },
  
  // Ajrak patterns (traditional Sindhi)
  ajrak: {
    primary: '#000080',
    secondary: '#800000',
    accent: '#FFFFFF',
  },
  
  // Phulkari patterns (traditional Punjabi)
  phulkari: {
    primary: '#FF69B4',
    secondary: '#FFD700',
    accent: '#FF4500',
  },
};

// Theme Modes
export const THEME_MODES = {
  light: {
    background: PAKISTANI_COLORS.background,
    surface: PAKISTANI_COLORS.surface,
    text: PAKISTANI_COLORS.text,
    textSecondary: PAKISTANI_COLORS.textSecondary,
    primary: PAKISTANI_COLORS.primary,
    accent: PAKISTANI_COLORS.saffron,
  },
  
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    primary: PAKISTANI_COLORS.primary,
    accent: PAKISTANI_COLORS.saffron,
  },
  
  // Cultural theme variations
  pakistanGreen: {
    background: '#F0F8F0',
    surface: '#FFFFFF',
    text: '#01411C',
    textSecondary: '#2D5A3D',
    primary: '#01411C',
    accent: '#FF9933',
  },
  
  saffronGold: {
    background: '#FFF8E1',
    surface: '#FFFFFF',
    text: '#BF360C',
    textSecondary: '#FF8F00',
    primary: '#FF9933',
    accent: '#FFD700',
  },
};

// Export default theme
export const DEFAULT_THEME = {
  colors: PAKISTANI_COLORS,
  fonts: FONTS,
  fontSizes: FONT_SIZES,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  dimensions: DIMENSIONS,
  shadows: SHADOWS,
  animationDuration: ANIMATION_DURATION,
  culturalPatterns: CULTURAL_PATTERNS,
  mode: THEME_MODES.light,
};