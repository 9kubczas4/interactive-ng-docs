import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h3 class="sidebar-title">
          <i class="pi pi-sitemap"></i>
          Navigation
        </h3>
      </div>
      <div class="menu-container">
        <p-panelMenu [model]="menuItems()" />
      </div>
    </div>
  `,
  styles: [`
    .sidebar-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      width: 320px;
      max-width: 320px;
      box-sizing: border-box;
    }
    
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      background: #ffffff;
    }
    
    .sidebar-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e40af;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      i {
        color: #1e40af;
      }
    }
    
    .menu-container {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      background: #ffffff;
    }
    
    @media (max-width: 768px) {
      .sidebar-content {
        width: 100%;
        max-width: 100%;
      }
    }
  `],
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
          icon: 'pi pi-fw pi-circle',
          routerLink: '/components/buttons'
        },
        {
          label: 'Forms',
          icon: 'pi pi-fw pi-circle',
          routerLink: '/components/forms'
        },
        {
          label: 'Tables',
          icon: 'pi pi-fw pi-circle',
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