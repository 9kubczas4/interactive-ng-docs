import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sidebar">
      <div class="p-3">
        <h4 class="text-600 mb-3">Documentation</h4>
        <p-panelMenu [model]="menuItems()" />
      </div>
    </div>
  `,
  imports: [PanelMenuModule]
})
export class SidebarComponent {
  menuItems = signal<MenuItem[]>([
    {
      label: 'Getting Started',
      icon: 'pi pi-fw pi-home',
      routerLink: '/getting-started'
    },
    {
      label: 'Components',
      icon: 'pi pi-fw pi-th-large',
      expanded: true,
      items: [
        {
          label: 'Buttons',
          routerLink: '/components/buttons'
        },
        {
          label: 'Forms',
          routerLink: '/components/forms'
        },
        {
          label: 'Tables',
          routerLink: '/components/tables'
        }
      ]
    },
    {
      label: 'Use Cases',
      icon: 'pi pi-fw pi-bookmark',
      expanded: true,
      items: [
        {
          label: 'Discard Changes',
          routerLink: '/use-cases/discard-changes'
        },
        {
          label: 'Form Validation',
          routerLink: '/use-cases/form-validation'
        },
        {
          label: 'Data Loading',
          routerLink: '/use-cases/data-loading'
        }
      ]
    }
  ]);
} 