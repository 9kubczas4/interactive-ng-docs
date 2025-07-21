import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { SidebarService } from '@core/services/sidebar.service';

@Component({
  selector: 'aside[appSidebar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [PanelMenuModule],
})
export class SidebarComponent {
  private sidebarService = inject(SidebarService);

  readonly isOpen = this.sidebarService.isOpen;

  menuItems = signal<MenuItem[]>([
    {
      label: 'Getting Started',
      icon: 'pi pi-fw pi-home',
      routerLink: '/getting-started',
    },
    {
      label: 'Patterns',
      icon: 'pi pi-fw pi-bookmark',
      expanded: true,
      items: [
        {
          label: 'Discard Changes',
          icon: 'pi pi-fw pi-undo',
          routerLink: '/patterns/discard-changes',
        },
        {
          label: 'Form Validation',
          icon: 'pi pi-fw pi-check-circle',
          routerLink: '/patterns/form-validation',
        },
        {
          label: 'Data Loading',
          icon: 'pi pi-fw pi-spinner',
          routerLink: '/patterns/data-loading',
        },
      ],
    },
    {
      label: 'Best Practices',
      icon: 'pi pi-fw pi-star',
      expanded: false,
      items: [
        {
          label: 'Clean Code',
          icon: 'pi pi-fw pi-code',
          routerLink: '/best-practices/clean-code',
        },
        {
          label: 'Component Architecture',
          icon: 'pi pi-fw pi-sitemap',
          routerLink: '/best-practices/component-architecture',
        },
        {
          label: 'Performance',
          icon: 'pi pi-fw pi-bolt',
          routerLink: '/best-practices/performance',
        },
      ],
    },
    {
      label: 'Accessibility',
      icon: 'pi pi-fw pi-eye',
      expanded: false,
      items: [
        {
          label: 'Introduction',
          icon: 'pi pi-fw pi-info-circle',
          routerLink: '/a11y/introduction',
        },
        {
          label: 'WCAG Guidelines',
          icon: 'pi pi-fw pi-list',
          routerLink: '/a11y/wcag-guidelines',
        },
        {
          label: 'Testing',
          icon: 'pi pi-fw pi-shield',
          routerLink: '/a11y/testing',
        },
      ],
    },
  ]);
}
