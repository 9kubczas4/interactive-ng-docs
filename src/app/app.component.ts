import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@core/layout/header/header.component';
import { SidebarComponent } from '@core/layout/sidebar/sidebar.component';
import { SidebarService } from '@core/services/sidebar.service';
import { ThemeService } from '@core/services/theme.service';
import { FloatingActionButtonsComponent } from '@shared/components/floating-action-buttons/floating-action-buttons.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="documentation-layout" [class.sidebar-collapsed]="!sidebarService.isOpen()">
      <div class="content-container">
        <aside appSidebar [class.sidebar-collapsed]="!sidebarService.isOpen()"></aside>
        <main
          class="main-content"
          [class.sidebar-collapsed]="!sidebarService.isOpen()"
          (click)="closeSidebarOnMobile()"
        >
          <router-outlet />
        </main>
      </div>
      <header appHeader></header>
      <app-floating-action-buttons />
    </div>
  `,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FloatingActionButtonsComponent],
})
export class AppComponent {
  title = 'Interactive Angular Documentation';

  sidebarService = inject(SidebarService);
  themeService = inject(ThemeService); // Initialize theme service

  closeSidebarOnMobile(): void {
    // Close sidebar on mobile when clicking on main content
    if (window.innerWidth <= 768) {
      this.sidebarService.close();
    }
  }
}
