import { ExampleItem } from '@shared/interfaces/example-item';

export interface DocumentationPageData {
  title: string;
  markdownContent: string;
  examples: ExampleItem[];
}
