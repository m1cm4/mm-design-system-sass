// =============================================================================
// MM Design System — TypeScript entry point
// =============================================================================
// Re-exports all types for convenient importing.
//
// Usage:
//   import type { ColorPalette, BreakpointMap } from '@mm-ds/core/ts';
// =============================================================================

export type {
  // Color tokens
  ShadeKey,
  NeutralShadeKey,
  ColorGroup,
  NeutralColorGroup,
  ColorGroupName,
  ColorPalette,
  ColorToken,
  // Breakpoints
  BreakpointMap,
  BreakpointName,
  // Sizes
  SizeScale,
  SizeStep,
  // Typography
  FontSizeKey,
  FontSizeMap,
  FontWeightMap,
  FontWeightName,
  FontFamilyMap,
  // Aggregate
  DesignTokens,
} from './types';
