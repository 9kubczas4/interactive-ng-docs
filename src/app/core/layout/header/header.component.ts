import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'header[appHeader]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink, ButtonModule]
})
export class HeaderComponent {
  private sidebarService = inject(SidebarService);
  
  toggleSidebar(): void {
    this.sidebarService.toggle();
  }
} 