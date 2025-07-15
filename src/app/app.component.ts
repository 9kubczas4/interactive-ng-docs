import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@core/layout/header/header.component';
import { SidebarComponent } from '@core/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="documentation-layout">
      <header appHeader></header>
      <div class="content-container">
        <main class="main-content">
          <router-outlet />
        </main>
        <aside appSidebar></aside>
      </div>
    </div>
  `,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent]
})
export class AppComponent {
  title = 'Interactive Angular Documentation';
} 