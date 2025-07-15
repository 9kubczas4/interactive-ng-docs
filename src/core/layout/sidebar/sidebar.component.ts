import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'aside[appSidebar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
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
      label: 'Use Cases',
      icon: 'pi pi-fw pi-bookmark',
      expanded: true,
      items: [
        {
          label: 'Discard Changes',
          icon: 'pi pi-fw pi-circle',
          routerLink: '/use-cases/discard-changes'
        },
        {
          label: 'Form Validation',
          icon: 'pi pi-fw pi-circle',
          routerLink: '/use-cases/form-validation'
        },
        {
          label: 'Data Loading',
          icon: 'pi pi-fw pi-circle',
          routerLink: '/use-cases/data-loading'
        }
      ]
    }
  ]);
} 