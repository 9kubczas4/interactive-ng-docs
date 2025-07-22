# Getting Started

Welcome to the Interactive Angular Documentation! This documentation system is built with Angular 19 and PrimeNG 19, providing a comprehensive guide to building modern web applications.

## Features

- **Interactive Examples**: Live examples in the sidebar show real components in action
- **Markdown Support**: All content is written in Markdown and rendered as HTML
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript**: Full TypeScript support with strict type checking
- **Developer CLI**: Easily add new pages and examples with a guided CLI tool

## Installation

To get started with this documentation system:

```bash
npm install
npm run start
```

## Project Structure

The project follows a clean architecture with three main folders:

- **core**: Layout components, services, error handlers, and interceptors
- **features**: Lazy-loaded examples
- **shared**: Reusable components, directives, and utilities
- **assets/docs**: Markdown documentation and example content

## Contributing

We welcome contributions! You can add new documentation pages and interactive examples using the built-in CLI tool.

### Adding a New Page

1. Run the CLI command:
   ```bash
   npm run add-page
   ```
2. Follow the interactive prompts:
   - Select page level (first or second level)
   - Enter the page label (e.g., "Clean Code")
   - Select an icon
   - Accept or override the suggested URL path and markdown file path
   - For second-level pages, select the parent page
3. The CLI will:
   - Update `src/assets/navigation.json`
   - Create the markdown file in the correct location with a template

### Adding a New Example

1. Run the CLI command:
   ```bash
   npm run add-example
   ```
2. Follow the interactive prompts:
   - Select the page to add the example to
   - Enter the example title and description
   - Select the category (best-practice or bad-example)
   - Accept or override the suggested component name and markdown path
3. The CLI will:
   - Update `src/assets/navigation.json` with the new example
   - Create the Angular component file in the correct feature folder
   - Add the component to the example component map
   - Create the example markdown documentation
   - The default example is an interactive counter using Angular signals

### Developer Workflow

- Use the CLI to add or update documentation content
- Edit the generated markdown and component files as needed
- Preview your changes locally with `npm run start`
- Submit a pull request with your improvements!

_For more details, see the README or explore the codebase. Happy documenting!_
