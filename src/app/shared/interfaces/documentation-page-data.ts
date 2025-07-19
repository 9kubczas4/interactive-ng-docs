import { ExampleItem } from '@shared/components/example-sidebar/example-sidebar.component';

export interface DocumentationPageData {
  title: string;
  markdownContent: string;
  examples: ExampleItem[];
}
