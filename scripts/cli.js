#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = query => new Promise(resolve => rl.question(query, resolve));

// Paths
const NAVIGATION_PATH = path.join(__dirname, '../src/assets/navigation.json');
const COMPONENT_MAP_PATH = path.join(__dirname, '../src/app/core/consts/example-components-map.ts');
const DOCS_PATH = path.join(__dirname, '../src/assets/docs');
const FEATURES_PATH = path.join(__dirname, '../src/app/features');

// Icons mapping for easy selection
const ICONS = {
  home: 'pi pi-fw pi-home',
  bookmark: 'pi pi-fw pi-bookmark',
  star: 'pi pi-fw pi-star',
  eye: 'pi pi-fw pi-eye',
  code: 'pi pi-fw pi-code',
  sitemap: 'pi pi-fw pi-sitemap',
  bolt: 'pi pi-fw pi-bolt',
  'info-circle': 'pi pi-fw pi-info-circle',
  list: 'pi pi-fw pi-list',
  shield: 'pi pi-fw pi-shield',
  undo: 'pi pi-fw pi-undo',
  'check-circle': 'pi pi-fw pi-check-circle',
  spinner: 'pi pi-fw pi-spinner',
};

async function loadNavigation() {
  const content = fs.readFileSync(NAVIGATION_PATH, 'utf8');
  return JSON.parse(content);
}

async function saveNavigation(navigation) {
  fs.writeFileSync(NAVIGATION_PATH, JSON.stringify(navigation, null, 2));
}

async function loadComponentMap() {
  const content = fs.readFileSync(COMPONENT_MAP_PATH, 'utf8');
  return content;
}

async function saveComponentMap(content) {
  fs.writeFileSync(COMPONENT_MAP_PATH, content);
}

async function addPage() {
  console.log('\n📄 Adding a new documentation page...\n');

  // Get page level
  const level = await question(
    'Select page level:\n1. First level (like "Getting Started")\n2. Second level (like "Discard Changes")\nEnter choice (1 or 2): '
  );

  if (level !== '1' && level !== '2') {
    console.log('❌ Invalid choice. Please enter 1 or 2.');
    return;
  }

  // Get page details
  const label = await question('Enter page label (e.g., "Clean Code"): ');
  const suggestedUrl = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const iconKey = await question(`Select icon (${Object.keys(ICONS).join(', ')}): `);
  const icon = ICONS[iconKey] || ICONS['info-circle'];

  const navigation = await loadNavigation();

  if (level === '1') {
    // First level page
    const hasContent = await question('Does this page have content? (y/n): ');

    const newPage = {
      label,
      icon,
      examples: [],
    };

    if (hasContent.toLowerCase() === 'y') {
      // Suggest URL path
      console.log(`Suggested URL path: ${suggestedUrl}`);
      const pathValue = (await question(`Enter URL path [${suggestedUrl}]: `)) || suggestedUrl;
      // Suggest markdown path
      const suggestedMarkdownPath = `docs/${pathValue}.md`;
      console.log(`Suggested markdown file: ${suggestedMarkdownPath}`);
      const markdownPath =
        (await question(`Enter markdown file path [${suggestedMarkdownPath}]: `)) ||
        suggestedMarkdownPath;

      newPage.path = pathValue;
      newPage.markdownPath = markdownPath;

      // Create markdown file
      const markdownContent = `# ${label}

Add your documentation content here.

## Overview

Describe what this page covers.

## Key Points

- Point 1
- Point 2
- Point 3

## Examples

This page includes interactive examples that demonstrate the concepts.
`;

      const markdownFilePath = path.join(DOCS_PATH, markdownPath.replace('docs/', ''));
      const markdownDir = path.dirname(markdownFilePath);

      if (!fs.existsSync(markdownDir)) {
        fs.mkdirSync(markdownDir, { recursive: true });
      }

      fs.writeFileSync(markdownFilePath, markdownContent);
      console.log(`✅ Created markdown file: ${markdownFilePath}`);
    } else {
      newPage.children = [];
    }

    navigation.push(newPage);
    console.log(`✅ Added first level page: ${label}`);
  } else {
    // Second level page
    console.log('\nAvailable first level pages:');
    navigation.forEach((item, index) => {
      console.log(`${index + 1}. ${item.label}`);
    });

    const parentIndex = await question('Select parent page (enter number): ');
    const parent = navigation[parseInt(parentIndex) - 1];

    if (!parent) {
      console.log('❌ Invalid parent selection.');
      return;
    }

    if (!parent.children) {
      parent.children = [];
    }

    // Suggest URL path
    console.log(`Suggested URL path: ${suggestedUrl}`);
    const pagePath = (await question(`Enter URL path [${suggestedUrl}]: `)) || suggestedUrl;
    // Suggest markdown path
    const parentPath = parent.label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const suggestedMarkdownPath = `docs/${parentPath}/${pagePath}.md`;
    console.log(`Suggested markdown file: ${suggestedMarkdownPath}`);
    const markdownPath =
      (await question(`Enter markdown file path [${suggestedMarkdownPath}]: `)) ||
      suggestedMarkdownPath;

    const newPage = {
      label,
      icon,
      path: `${parentPath}/${pagePath}`,
      markdownPath,
      examples: [],
    };

    parent.children.push(newPage);

    // Create markdown file
    const markdownContent = `# ${label}

Add your documentation content here.

## Overview

Describe what this page covers.

## Key Points

- Point 1
- Point 2
- Point 3

## Examples

This page includes interactive examples that demonstrate the concepts.
`;

    const markdownFilePath = path.join(DOCS_PATH, markdownPath.replace('docs/', ''));
    const markdownDir = path.dirname(markdownFilePath);

    if (!fs.existsSync(markdownDir)) {
      fs.mkdirSync(markdownDir, { recursive: true });
    }

    fs.writeFileSync(markdownFilePath, markdownContent);
    console.log(`✅ Created markdown file: ${markdownFilePath}`);

    console.log(`✅ Added second level page: ${label} under ${parent.label}`);
  }

  await saveNavigation(navigation);
  console.log('✅ Navigation updated successfully!');
}

async function addExample() {
  console.log('\n🔧 Adding a new example...\n');

  const navigation = await loadNavigation();

  // Find all pages with content (have path and markdownPath)
  const pagesWithContent = [];

  function collectPages(items, parentPath = '') {
    items.forEach(item => {
      if (item.path && item.markdownPath) {
        pagesWithContent.push({
          label: item.label,
          path: item.path,
          fullPath: parentPath ? `${parentPath} > ${item.label}` : item.label,
        });
      }
      if (item.children) {
        collectPages(item.children, parentPath ? `${parentPath} > ${item.label}` : item.label);
      }
    });
  }

  collectPages(navigation);

  if (pagesWithContent.length === 0) {
    console.log('❌ No pages with content found. Please add a page first.');
    return;
  }

  console.log('Available pages:');
  pagesWithContent.forEach((page, index) => {
    console.log(`${index + 1}. ${page.fullPath}`);
  });

  const pageIndex = await question('Select page to add example to (enter number): ');
  const selectedPage = pagesWithContent[parseInt(pageIndex) - 1];

  if (!selectedPage) {
    console.log('❌ Invalid page selection.');
    return;
  }

  // Get example details
  const title = await question('Enter example title (e.g., "Basic Form Validation"): ');
  const description = await question('Enter example description: ');

  // Category selection
  console.log('Select category:');
  console.log('  1. best-practice');
  console.log('  2. bad-example');
  let categoryNum = await question('Enter number (1 or 2): ');
  while (categoryNum !== '1' && categoryNum !== '2') {
    categoryNum = await question('Please enter 1 or 2: ');
  }
  const category = categoryNum === '1' ? 'best-practice' : 'bad-example';

  // Suggest component name
  const suggestedComponentName =
    title
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + 'ExampleComponent';
  const componentName =
    (await question(`Enter component name [${suggestedComponentName}]: `)) ||
    suggestedComponentName;

  // Suggest markdown path
  const pagePath = selectedPage.path.replace(/\//g, '-');
  const exampleSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suggestedMarkdownPath = `docs/examples/${pagePath}/${exampleSlug}.md`;
  console.log(`Suggested markdown file: ${suggestedMarkdownPath}`);
  const markdownPath =
    (await question(`Enter example markdown path [${suggestedMarkdownPath}]: `)) ||
    suggestedMarkdownPath;

  // Find the page in navigation and add example
  function addExampleToPage(items) {
    for (let item of items) {
      if (item.path === selectedPage.path) {
        if (!item.examples) {
          item.examples = [];
        }

        const componentPath =
          selectedPage.path +
          '/' +
          componentName
            .replace(/ExampleComponent$/, '')
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase() +
          '.component';

        item.examples.push({
          title,
          description,
          componentPath,
          markdownPath,
          category,
        });

        return true;
      }
      if (item.children && addExampleToPage(item.children)) {
        return true;
      }
    }
    return false;
  }

  addExampleToPage(navigation);

  // Create example component
  const componentContent = `import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-${componentName
    .replace(/ExampleComponent$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="example-container">
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="example-content">
        <p>Counter value: {{ count() }}</p>
        <button (click)="decrement()">-</button>
        <button (click)="increment()">+</button>
      </div>
    </div>
  \`,
  styles: \`
    .example-container {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 1rem 0;
    }
    .example-content {
      margin-top: 1rem;
    }
    button {
      margin: 0 0.5rem;
      padding: 0.25rem 0.75rem;
      font-size: 1rem;
    }
  \`
})
export class ${componentName} {
  count = signal(0);
  increment() { this.count.update(v => v + 1); }
  decrement() { this.count.update(v => v - 1); }
}
`;

  // Create component file
  const componentDir = path.join(FEATURES_PATH, selectedPage.path.replace('/', '/'));
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  const componentFileName =
    componentName
      .replace(/ExampleComponent$/, '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase() + '.component.ts';
  const componentFilePath = path.join(componentDir, componentFileName);
  fs.writeFileSync(componentFilePath, componentContent);
  console.log(`✅ Created component file: ${componentFilePath}`);

  // Create example markdown
  const markdownContent = `# ${title}

${description}

## Overview

This example demonstrates ${category === 'best-practice' ? 'best practices' : 'common pitfalls'} for ${selectedPage.label.toLowerCase()}.

## Code

\`\`\`typescript
// Example code will be shown here
\`\`\`

## Key Points

- Point 1
- Point 2
- Point 3
`;

  const markdownFilePath = path.join(DOCS_PATH, markdownPath.replace('docs/', ''));
  const markdownDir = path.dirname(markdownFilePath);

  if (!fs.existsSync(markdownDir)) {
    fs.mkdirSync(markdownDir, { recursive: true });
  }

  fs.writeFileSync(markdownFilePath, markdownContent);
  console.log(`✅ Created markdown file: ${markdownFilePath}`);

  // Update component map
  const componentMapContent = await loadComponentMap();
  const componentPath =
    selectedPage.path +
    '/' +
    componentName
      .replace(/ExampleComponent$/, '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase() +
    '.component';

  const newEntry = `  '${componentPath}': () =>
    import('@features/${componentPath}').then(
      m => m.${componentName}
    ),`;

  const updatedContent = componentMapContent.replace(
    '  // {{ @placeholder }}',
    `${newEntry}\n  // {{ @placeholder }}`
  );

  await saveComponentMap(updatedContent);
  console.log('✅ Updated component map');

  await saveNavigation(navigation);
  console.log('✅ Navigation updated successfully!');
}

async function main() {
  const command = process.argv[2];

  if (!command) {
    console.log('📚 Documentation CLI Tool\n');
    console.log('Usage:');
    console.log('  node scripts/cli.js add-page    - Add a new documentation page');
    console.log('  node scripts/cli.js add-example - Add a new example to a page');
    return;
  }

  try {
    switch (command) {
      case 'add-page':
        await addPage();
        break;
      case 'add-example':
        await addExample();
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('Available commands: add-page, add-example');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
