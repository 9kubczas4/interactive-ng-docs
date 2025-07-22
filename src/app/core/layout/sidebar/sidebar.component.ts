import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { SidebarService } from '@core/services/sidebar.service';
import { NavigationService, NavigationItem } from '@core/services/navigation.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'aside[appSidebar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [PanelMenuModule],
})
export class SidebarComponent {
  private sidebarService = inject(SidebarService);
  private navigationService = inject(NavigationService);

  readonly isOpen = this.sidebarService.isOpen;

  readonly menuItems = toSignal(
    this.navigationService.getNavigation().pipe(map(items => this.mapToMenuItems(items))),
    { initialValue: [] }
  );

  private mapToMenuItems(items: NavigationItem[]): MenuItem[] {
    return items.map(item => ({
      label: item.label,
      icon: item.icon,
      routerLink: item.path ? '/' + item.path : undefined,
      items: item.children ? this.mapToMenuItems(item.children) : undefined,
    }));
  }
}
