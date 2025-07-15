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
      background: #fafafa;
      width: 320px;
      max-width: 320px;
      box-sizing: border-box;
    }
    
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      background: #fafafa;
    }
    
    .sidebar-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2563eb;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      i {
        color: #2563eb;
      }
    }
    
    .menu-container {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      background: #fafafa;
    }
    
    :host ::ng-deep .p-panelmenu {
      background: #fafafa;
      
      .p-panelmenu-header {
        .p-panelmenu-header-content {
          background: #fafafa;
          border: none;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
          
          &:hover {
            background: #dbeafe;
            border-left-color: #2563eb;
          }
          
          .p-panelmenu-header-action {
            color: #2563eb;
            font-weight: 600;
            font-size: 0.95rem;
            
            .p-menuitem-icon {
              color: #2563eb;
              margin-right: 0.5rem;
            }
          }
        }
      }
      
      .p-panelmenu-content {
        background: #fafafa;
        border: none;
        padding: 0;
        margin-left: 1rem;
        border-left: 2px solid #93c5fd;
        
        .p-panelmenu-root-list {
          .p-menuitem {
            .p-menuitem-content {
              padding: 0.5rem 1rem;
              margin-bottom: 0.25rem;
              border-radius: 6px;
              transition: all 0.2s ease;
              position: relative;
              background: #fafafa;
              
              &:before {
                content: '';
                position: absolute;
                left: -1rem;
                top: 50%;
                width: 12px;
                height: 1px;
                background: #93c5fd;
              }
              
              &:hover {
                background: #dbeafe;
                transform: translateX(4px);
              }
              
              .p-menuitem-link {
                color: #1e40af;
                font-weight: 400;
                font-size: 0.9rem;
                
                &:hover {
                  color: #2563eb;
                }
              }
            }
          }
        }
      }
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