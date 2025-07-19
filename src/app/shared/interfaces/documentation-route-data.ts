import { ExampleItem } from '@shared/components/example-sidebar/example-sidebar.component';

export interface DocumentationRouteData {
  title: string;
  markdownPath: string;
  examples?: ExampleItem[];
}
