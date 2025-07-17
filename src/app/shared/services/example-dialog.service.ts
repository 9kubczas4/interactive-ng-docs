import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ExampleItem } from '../components/example-sidebar/example-sidebar.component';

@Injectable({
  providedIn: 'root'
})
export class ExampleDialogService {
  private readonly router = inject(Router);
  
  private readonly _examples = signal<ExampleItem[]>([]);
  private readonly _currentRoute = signal<string>('');
  
  readonly examples = this._examples.asReadonly();
  readonly currentRoute = this._currentRoute.asReadonly();
  
  setExamples(examples: ExampleItem[]): void {
    this._examples.set(examples);
  }
  
  setCurrentRoute(route: string): void {
    this._currentRoute.set(route);
  }
  
  openExample(exampleTitle: string): void {
    const exampleId = this.getExampleId(exampleTitle);
    
    // Navigate to current route with dialog query params
    this.router.navigate([], {
      relativeTo: null,
      queryParams: { dialog: 'true', example: exampleId },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
  }
  
  closeExample(): void {
    // Remove dialog query params
    this.router.navigate([], {
      relativeTo: null,
      queryParams: { dialog: null, example: null },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
  }
  
  getExampleById(id: string): ExampleItem | undefined {
    return this._examples().find(ex => this.getExampleId(ex.title) === id);
  }

  private getExampleId(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
} 