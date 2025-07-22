import { EXAMPLE_COMPONENT_MAP } from '@core/consts/example-components-map';
import { ComponentLoader } from '@shared/interfaces/example-item';

export class ExampleComponentLoader {
  /**
   * Get the component loader for a given component path.
   * @param componentPath The relative path to the component (e.g., 'patterns/discard-changes/basic-discard-example.component')
   * @returns The component loader function or null if not found
   */
  getComponentLoader(componentPath: string): ComponentLoader | null {
    return EXAMPLE_COMPONENT_MAP[componentPath] || null;
  }

  /**
   * Check if a component path is registered in the map.
   * @param componentPath The relative path to the component
   * @returns True if the component is registered
   */
  hasComponent(componentPath: string): boolean {
    return componentPath in EXAMPLE_COMPONENT_MAP;
  }

  /**
   * Get all registered component paths.
   * @returns Array of all registered component paths
   */
  getRegisteredPaths(): string[] {
    return Object.keys(EXAMPLE_COMPONENT_MAP);
  }
}
