import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@core/layout/header/header.component';
import { SidebarComponent } from '@core/layout/sidebar/sidebar.component';
import { SidebarService } from '@core/services/sidebar.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="documentation-layout" [class.sidebar-collapsed]="!sidebarService.isOpen()">
      <header appHeader></header>
      <div class="content-container">
        <main class="main-content" [class.sidebar-collapsed]="!sidebarService.isOpen()" (click)="closeSidebarOnMobile()">
          <router-outlet />
        </main>
        <aside appSidebar [class.sidebar-collapsed]="!sidebarService.isOpen()"></aside>
      </div>
    </div>
  `,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent]
})
export class AppComponent {
  title = 'Interactive Angular Documentation';
  
  sidebarService = inject(SidebarService);
  
  closeSidebarOnMobile(): void {
    // Close sidebar on mobile when clicking on main content
    if (window.innerWidth <= 768) {
      this.sidebarService.close();
    }
  }
} 