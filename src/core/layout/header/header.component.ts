import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-toolbar>
      <div class="p-toolbar-group-start">
        <h2 class="m-0 text-primary">
          <i class="pi pi-book mr-2"></i>
          Angular Documentation
        </h2>
      </div>
      <div class="p-toolbar-group-end">
        <p-button
          icon="pi pi-github"
          class="p-button-text"
          severity="secondary"
          label="GitHub"
          routerLink="/getting-started"
        />
      </div>
    </p-toolbar>
  `,
  imports: [RouterLink, ButtonModule, ToolbarModule]
})
export class HeaderComponent {} 