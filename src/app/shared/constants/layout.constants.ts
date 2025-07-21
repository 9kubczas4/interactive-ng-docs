/**
 * Layout constants shared between SCSS variables and TypeScript code
 *
 * Note: These values should match the corresponding SCSS variables in _variables.scss
 */

// Header and layout dimensions
export const HEADER_HEIGHT = 70; // Matches $header-height
export const HEADER_TOTAL_HEIGHT = 84; // Header height + padding/border (matches $toc-header-offset-px)

// Table of Contents intersection observer settings
export const TOC_HEADER_OFFSET = 84; // For intersection observer rootMargin (matches $toc-header-offset-px)
export const TOC_SCROLL_THRESHOLD = 20; // Additional offset for scroll detection (matches $toc-scroll-threshold)
export const TOC_MOBILE_BREAKPOINT = 768; // Mobile breakpoint (matches $breakpoint-md)

// Intersection observer thresholds
export const TOC_INTERSECTION_THRESHOLDS = [0, 0.1, 0.3];

// Timing constants for DOM operations
export const DOM_UPDATE_DELAY = 100;
export const SCROLL_DETECTION_DELAY = 50;
export const ROUTE_CHANGE_DELAY = 500;
