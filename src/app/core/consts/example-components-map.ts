import { ComponentLoader } from '@shared/interfaces/example-item';

/**
 * Maps component paths to their lazy load functions.
 * This centralizes all component loading logic.
 */
export const EXAMPLE_COMPONENT_MAP: Record<string, ComponentLoader> = {
  'getting-started/welcome-button-example.component': () =>
    import('@features/getting-started/welcome-button-example.component').then(
      m => m.WelcomeButtonExampleComponent
    ),
  'patterns/discard-changes/basic-discard-example.component': () =>
    import('@features/patterns/discard-changes/basic-discard-example.component').then(
      m => m.BasicDiscardExampleComponent
    ),
  'patterns/discard-changes/confirmation-discard-example.component': () =>
    import('@features/patterns/discard-changes/confirmation-discard-example.component').then(
      m => m.ConfirmationDiscardExampleComponent
    ),
  // {{ @placeholder }}
};
