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
    @import "../../../styles/variables.scss";
    
    .sidebar-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: $color-white;
      width: $sidebar-width;
      max-width: $sidebar-width;
      box-sizing: border-box;
    }
    
    .sidebar-header {
      padding: $space-xl;
      border-bottom: 1px solid $color-gray-300;
      background: $color-white;
    }
    
    .sidebar-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $color-blue-800;
      margin: 0;
      display: flex;
      align-items: center;
      gap: $space-sm;
      
      i {
        color: $color-blue-800;
      }
    }
    
    .menu-container {
      flex: 1;
      padding: $space-lg;
      overflow-y: auto;
      background: $color-white;
    }
    
    @media (max-width: $breakpoint-md) {
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