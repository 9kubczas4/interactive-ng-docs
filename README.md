# # Interactive Angular Documentation

A modern, interactive documentation system built with Angular 19 and PrimeNG 19, featuring Static Site Generation (SSG) and live examples.

## Features

- **🌟 Modern UI**: Beautiful gradient design with glass-morphism effects
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **⚡ SSG Support**: Static Site Generation for optimal performance
- **🎨 PrimeNG 19**: Latest UI components with Aura theme
- **📝 Markdown Support**: Write documentation in Markdown, rendered as HTML
- **🔍 Live Examples**: Interactive examples in the sidebar
- **🎯 TypeScript**: Full TypeScript support with strict type checking
- **🏗️ Clean Architecture**: Well-organized folder structure (core, features, shared)

## Project Structure

```
src/
├── core/           # Layout, services, error handlers, interceptors
│   ├── layout/     # Header, sidebar components
│   └── services/   # Markdown service, etc.
├── features/       # Lazy-loaded pages with use cases
│   ├── getting-started/
│   ├── components/
│   └── use-cases/
└── shared/         # Shared components, directives, utilities
    └── components/
```

## Getting Started

### Prerequisites

- Node.js 18.19.1 or newer
- Angular CLI 19.x
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the development server:
```bash
npm start
```

Navigate to `http://localhost:4200`. The application will automatically reload if you change any source files.

### Build

Build the project:
```bash
npm run build
```

### Static Site Generation

Generate a static version of the site:
```bash
npm run prerender
```

## Documentation Pages

- **Getting Started**: Introduction and setup instructions
- **Components**: UI component documentation with examples
- **Use Cases**: Real-world implementation patterns
  - Discard Changes Pattern
  - Form Validation
  - Data Loading States

## Technology Stack

- **Angular 19**: Latest Angular framework with standalone components
- **PrimeNG 19**: UI component library with Aura theme
- **TypeScript**: Strict type checking enabled
- **SCSS**: Advanced styling with CSS variables
- **Marked**: Markdown to HTML conversion
- **Signals**: Modern reactive state management

## Contributing

1. Follow the established folder structure
2. Use standalone components with `ChangeDetectionStrategy.OnPush`
3. Implement proper TypeScript typing
4. Add interactive examples for new features
5. Write documentation in Markdown

## Architecture Highlights

- **Standalone Components**: No NgModules required
- **Signals**: Used for reactive state management
- **Lazy Loading**: Features are loaded on-demand
- **Path Mapping**: Clean imports with `@core`, `@features`, `@shared`
- **Markdown Integration**: Seamless markdown rendering with syntax highlighting