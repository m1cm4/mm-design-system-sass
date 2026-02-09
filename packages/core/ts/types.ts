// =============================================================================
// MM Design System — TypeScript Token Interfaces
// =============================================================================
// These interfaces define the expected shape of design tokens.
// Projects using @mm-ds/core should conform to these structures
// when exporting tokens via :export in SCSS Modules.
//
// Usage:
//   import type { ColorPalette, BreakpointMap } from '@mm-ds/core/ts';
// =============================================================================

/** A shade scale from 100 to 500 */
export type ShadeKey = '100' | '200' | '300' | '400' | '500';

/** Neutral palette includes white and black in addition to shades */
export type NeutralShadeKey = 'white' | ShadeKey | 'black';

/** A single color group with shade values */
export type ColorGroup = Record<ShadeKey, string>;

/** The neutral color group with additional white/black keys */
export type NeutralColorGroup = Record<NeutralShadeKey, string>;

/** Semantic color group names */
export type ColorGroupName =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'error';

/**
 * Full color palette exported from SCSS.
 * Keys are flattened as "group-shade" (e.g., "primary-400", "neutral-white").
 */
export interface ColorPalette {
  // Neutral
  'neutral-white': string;
  'neutral-100': string;
  'neutral-200': string;
  'neutral-300': string;
  'neutral-400': string;
  'neutral-500': string;
  'neutral-black': string;
  // Primary
  'primary-100': string;
  'primary-200': string;
  'primary-300': string;
  'primary-400': string;
  'primary-500': string;
  // Secondary
  'secondary-100': string;
  'secondary-200': string;
  'secondary-300': string;
  'secondary-400': string;
  'secondary-500': string;
  // Accent
  'accent-100': string;
  'accent-200': string;
  'accent-300': string;
  'accent-400': string;
  'accent-500': string;
  // Success
  'success-100': string;
  'success-200': string;
  'success-300': string;
  'success-400': string;
  'success-500': string;
  // Error
  'error-100': string;
  'error-200': string;
  'error-300': string;
  'error-400': string;
  'error-500': string;
}

/** A color token key from the palette */
export type ColorToken = keyof ColorPalette;

/**
 * Breakpoint map exported from SCSS.
 * Values are em strings (e.g., "30em").
 */
export interface BreakpointMap {
  small: string;
  medium: string;
  large: string;
}

/** A breakpoint name */
export type BreakpointName = keyof BreakpointMap;

/**
 * Size scale exported from SCSS (0–15).
 * Values are rem strings (e.g., "1rem", "0.25rem").
 */
export interface SizeScale {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
  '4': string;
  '5': string;
  '6': string;
  '7': string;
  '8': string;
  '9': string;
  '10': string;
  '11': string;
  '12': string;
  '13': string;
  '14': string;
  '15': string;
}

/** A size step key */
export type SizeStep = keyof SizeScale;

/** Font size keys (200–900) */
export type FontSizeKey = '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

/**
 * Font size map exported from SCSS.
 * Values are rem strings (e.g., "1rem").
 * These are the "small" breakpoint values by default.
 */
export type FontSizeMap = Record<FontSizeKey, string>;

/**
 * Font weight map exported from SCSS.
 * Keys are semantic names, values are numeric strings.
 */
export interface FontWeightMap {
  thin: string;
  'extra-light': string;
  light: string;
  regular: string;
  medium: string;
  'semi-bold': string;
  bold: string;
  'extra-bold': string;
  black: string;
}

/** A font weight name */
export type FontWeightName = keyof FontWeightMap;

/**
 * Font family map exported from SCSS.
 */
export interface FontFamilyMap {
  base: string;
  accent: string;
}

/**
 * Complete design system tokens.
 * Aggregates all token categories.
 */
export interface DesignTokens {
  colors: ColorPalette;
  breakpoints: BreakpointMap;
  sizes: SizeScale;
  fontSizes: FontSizeMap;
  fontWeights: FontWeightMap;
  fontFamilies: FontFamilyMap;
}
