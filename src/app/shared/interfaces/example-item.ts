import { Type, InjectionToken } from '@angular/core';

export interface ExampleItem {
  title: string;
  description?: string;
  component: () => Promise<Type<unknown>>;
  markdownPath?: string;
  category?: 'best-practice' | 'bad-example';
}

export interface NavigationExampleItem {
  title: string;
  description: string;
  componentPath: string;
  markdownPath: string;
  category: string;
}

export interface ComponentLoader {
  (): Promise<Type<unknown>>;
}

export const EXAMPLE_COMPONENT_LOADER = new InjectionToken<Record<string, ComponentLoader>>(
  'EXAMPLE_COMPONENT_LOADER'
);
