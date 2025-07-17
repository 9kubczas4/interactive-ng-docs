import { Component, ChangeDetectionStrategy, inject, signal, OnInit, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { ExampleItem } from '../example-sidebar/example-sidebar.component';
import { ExampleDialogService } from '../../services/example-dialog.service';

@Component({
  selector: 'app-example-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './example-dialog.component.html',
  styleUrls: ['./example-dialog.component.scss'],
  imports: [
    DialogModule, 
    ButtonModule, 
    AccordionModule, 
    TooltipModule,
    CommonModule
  ]
})
export class ExampleDialogComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(ExampleDialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly clipboard = inject(Clipboard);
  
  readonly isVisible = signal(false);
  readonly currentExample = signal<ExampleItem | null>(null);
  readonly currentExampleIndex = signal(0);
  readonly dialogTitle = signal('Interactive Example');
  readonly copySuccess = signal(false);
  
  readonly availableExamples = computed(() => this.dialogService.examples());
  
  ngOnInit(): void {
    // Listen for query params to control dialog visibility and example selection
    this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(queryParams => {
      const showDialog = queryParams['dialog'] === 'true';
      const exampleId = queryParams['example'];
      
      if (showDialog && exampleId) {
        this.openExample(exampleId);
      } else if (showDialog && this.availableExamples().length > 0) {
        // If no specific example, show first one
        this.openExample(this.getExampleId(this.availableExamples()[0].title));
      } else {
        this.isVisible.set(false);
      }
    });
  }
  
  openExample(exampleId: string): void {
    const examples = this.availableExamples();
    const exampleIndex = examples.findIndex(ex => this.getExampleId(ex.title) === exampleId);
    const example = examples[exampleIndex];
    
    if (example && exampleIndex !== -1) {
      this.currentExample.set(example);
      this.currentExampleIndex.set(exampleIndex);
      this.dialogTitle.set(`Interactive Example: ${example.title}`);
      this.isVisible.set(true);
    }
  }
  
  navigateToPrevious(): void {
    const currentIndex = this.currentExampleIndex();
    const examples = this.availableExamples();
    
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newExample = examples[newIndex];
      this.setCurrentExample(newExample, newIndex);
    }
  }
  
  navigateToNext(): void {
    const currentIndex = this.currentExampleIndex();
    const examples = this.availableExamples();
    
    if (currentIndex < examples.length - 1) {
      const newIndex = currentIndex + 1;
      const newExample = examples[newIndex];
      this.setCurrentExample(newExample, newIndex);
    }
  }
  
  closeDialog(): void {
    this.isVisible.set(false);
    this.currentExample.set(null);
    this.currentExampleIndex.set(0);
    this.dialogService.closeExample();
  }
  
  copyCode(code: string): void {
    const success = this.clipboard.copy(code);
    if (success) {
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    }
  }
  
  private getExampleId(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  private setCurrentExample(example: ExampleItem, index: number): void {
    this.currentExample.set(example);
    this.currentExampleIndex.set(index);
    this.dialogTitle.set(`Interactive Example: ${example.title}`);
    
    // Update URL to reflect current example
    const exampleId = this.getExampleId(example.title);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { dialog: 'true', example: exampleId },
      queryParamsHandling: 'merge'
    });
  }
} 