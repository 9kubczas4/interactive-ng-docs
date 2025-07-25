import { DOCUMENT } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@core/layout/header/header.component';
import { SidebarComponent } from '@core/layout/sidebar/sidebar.component';
import { SidebarService } from '@core/services/sidebar.service';
import { ThemeService } from '@core/services/theme.service';
import { FloatingActionButtonsComponent } from '@core/layout/floating-action-buttons/floating-action-buttons.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="documentation-layout" [class.sidebar-collapsed]="!sidebarService.isOpen()">
      <header appHeader></header>
      <div class="content-container">
        <aside appSidebar [class.sidebar-collapsed]="!sidebarService.isOpen()"></aside>
        <main
          class="main-content"
          [class.sidebar-collapsed]="!sidebarService.isOpen()"
          (click)="closeSidebarOnMobile()"
          (keyup.escape)="closeSidebarOnMobile()"
          tabindex="-1"
        >
          <router-outlet />
        </main>
      </div>
      <app-floating-action-buttons />
    </div>
  `,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FloatingActionButtonsComponent],
})
export class AppComponent {
  readonly document = inject(DOCUMENT);
  readonly sidebarService = inject(SidebarService);
  readonly themeService = inject(ThemeService);

  closeSidebarOnMobile(): void {
    // Close sidebar on mobile when clicking on main content
    if (this.document.defaultView?.innerWidth && this.document.defaultView.innerWidth <= 768) {
      this.sidebarService.close();
    }
  }
}
