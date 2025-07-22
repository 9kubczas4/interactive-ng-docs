import { ExampleItem } from '@shared/interfaces/example-item';

export interface DocumentationRouteData {
  title: string;
  markdownPath: string;
  examples?: ExampleItem[];
}
