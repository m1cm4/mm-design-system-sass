// =============================================================================
// Example: Using Design System tokens in TypeScript
// =============================================================================
// This file demonstrates how to import SCSS tokens and use the core types.
// It is NOT imported by the application — it serves as documentation.
// =============================================================================

// 1. Import types from the core package
import type {
  ColorToken,
  BreakpointName,
  SizeStep,
  FontSizeKey,
} from '@mm-ds/core/ts';

// 2. Import ALL token values from the single bridge file
import tokens from '../scss/ts-bridge/_tokens.module.scss';

// ----------------------------------------------------------------------------
// Usage examples
// ----------------------------------------------------------------------------

// Access a specific color value (prefixed with "clr-")
const primaryColor = tokens['clr-primary-400'];
// => "oklch(55.857% 0.1908 256.019)"

// Access a breakpoint (prefixed with "bp-")
const mediumBp = tokens['bp-medium'];
// => "45em"

// Access a size from the scale (prefixed with "size-")
const spacing = tokens['size-4'];
// => "1rem"

// Access a font size (prefixed with "fs-")
const bodySize = tokens['fs-400'];
// => "1rem"

// Access a font weight (prefixed with "fw-")
const bold = tokens['fw-bold'];
// => "700"

// Access a font family (prefixed with "ff-")
const baseFont = tokens['ff-base'];
// => "Inter, system-ui, ..."

// Type-safe helper using core types
function getColorToken(token: ColorToken): string {
  return tokens[`clr-${token}`];
}

// Responsive breakpoint check
function isAboveBreakpoint(bp: BreakpointName, viewportEm: number): boolean {
  const value = parseFloat(tokens[`bp-${bp}`]);
  return viewportEm >= value;
}

// Dynamic CSS variable reference
function getFontSizeCssVar(key: FontSizeKey): string {
  return `var(--fs-${key})`;
}

// Log all available tokens
console.log('All tokens:', tokens);
