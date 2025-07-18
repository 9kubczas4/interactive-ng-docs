import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-welcome-button-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-button 
      label="Welcome!" 
      icon="pi pi-check" 
      severity="success"
      (click)="showWelcome()"
    />
    @if (showMessage()) {
      <p class="mt-2 text-green-600">Welcome to Angular Documentation!</p>
    }
  `,
  imports: [ButtonModule]
})
export class WelcomeButtonExampleComponent {
  showMessage = signal(false);
  
  showWelcome(): void {
    this.showMessage.set(true);
    setTimeout(() => this.showMessage.set(false), 3000);
  }
} 