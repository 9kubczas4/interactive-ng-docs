import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isOpen = signal(true);
  
  readonly isOpen = this._isOpen.asReadonly();
  
  toggle(): void {
    this._isOpen.set(!this._isOpen());
  }
  
  open(): void {
    this._isOpen.set(true);
  }
  
  close(): void {
    this._isOpen.set(false);
  }
} 