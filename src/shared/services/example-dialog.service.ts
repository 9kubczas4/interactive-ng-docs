import { Injectable, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExampleItem } from '../components/example-sidebar/example-sidebar.component';

@Injectable({
  providedIn: 'root'
})
export class ExampleDialogService {
  private router = inject(Router);
  
  private _examples = signal<ExampleItem[]>([]);
  private _currentRoute = signal<string>('');
  
  readonly examples = this._examples.asReadonly();
  readonly currentRoute = this._currentRoute.asReadonly();
  
  setExamples(examples: ExampleItem[]) {
    this._examples.set(examples);
  }
  
  setCurrentRoute(route: string) {
    this._currentRoute.set(route);
  }
  
  openExample(exampleTitle: string) {
    const exampleId = this.getExampleId(exampleTitle);
    
    // Navigate to current route with dialog query params
    this.router.navigate([], {
      relativeTo: null,
      queryParams: { dialog: 'true', example: exampleId },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
  }
  
  closeExample() {
    // Remove dialog query params
    this.router.navigate([], {
      relativeTo: null,
      queryParams: { dialog: null, example: null },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
  }
  
  private getExampleId(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  
  getExampleById(id: string): ExampleItem | undefined {
    return this._examples().find(ex => this.getExampleId(ex.title) === id);
  }
} 