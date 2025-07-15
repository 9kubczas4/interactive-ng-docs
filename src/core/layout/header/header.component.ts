import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="header-content">
      <div class="logo-section">
        <i class="pi pi-book logo-icon"></i>
        <h1 class="logo-title">Interactive Angular Docs</h1>
      </div>
      <div class="header-actions">
        <p-button
          icon="pi pi-github"
          [text]="true"
          severity="secondary"
          label="GitHub"
          routerLink="/getting-started"
          class="github-button"
        />
      </div>
    </div>
  `,
  styles: [`
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo-icon {
      font-size: 1.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .logo-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.025em;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    :host ::ng-deep .github-button {
      .p-button-label {
        font-weight: 500;
      }
    }
    
    @media (max-width: 768px) {
      .logo-title {
        font-size: 1.25rem;
      }
      
      .logo-icon {
        font-size: 1.5rem;
      }
    }
  `],
  imports: [RouterLink, ButtonModule]
})
export class HeaderComponent {} 