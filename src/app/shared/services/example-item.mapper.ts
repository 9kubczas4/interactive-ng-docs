import { inject, Injectable } from '@angular/core';
import {
  EXAMPLE_COMPONENT_LOADER,
  ExampleItem,
  NavigationExampleItem,
} from '@shared/interfaces/example-item';

/**
 * Maps a NavigationExampleItem (from navigation JSON) to an ExampleItem (runtime, with component reference).
 * Uses the component map service for reliable component imports.
 */
@Injectable({ providedIn: 'root' })
export class ExampleItemMapper {
  private readonly componentLoader = inject(EXAMPLE_COMPONENT_LOADER);

  toExampleItem(navItem: NavigationExampleItem): ExampleItem {
    const componentLoader = this.componentLoader[navItem.componentPath]();

    if (!componentLoader) {
      throw new Error(
        `Component for path '${navItem.componentPath}' not found in component map. ` +
          `Available paths: ${Object.keys(this.componentLoader).join(', ')}`
      );
    }

    return {
      title: navItem.title,
      description: navItem.description,
      component: () => componentLoader,
      markdownPath: navItem.markdownPath,
      category: navItem.category as 'best-practice' | 'bad-example',
    };
  }
}
