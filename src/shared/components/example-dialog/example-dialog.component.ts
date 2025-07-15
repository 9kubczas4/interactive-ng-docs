import { Component, ChangeDetectionStrategy, inject, signal, OnInit, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { ExampleItem } from '../example-sidebar/example-sidebar.component';
import { ExampleDialogService } from '../../services/example-dialog.service';

// Import standalone example components
import { WelcomeButtonExampleComponent } from '../examples/welcome-button-example.component';
import { BasicDiscardExampleComponent } from '../examples/basic-discard-example.component';
import { ConfirmationDiscardExampleComponent } from '../examples/confirmation-discard-example.component';

@Component({
  selector: 'app-example-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dialog 
      [visible]="isVisible()"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      [maximizable]="true"
      [breakpoints]="{'960px': '75vw', '641px': '90vw'}"
      [style]="{width: '80vw', maxWidth: '1200px'}"
      [header]="dialogTitle()"
      (onHide)="closeDialog()"
      styleClass="example-dialog"
    >
      <div class="dialog-content">
        @if (currentExample()) {
          <div class="example-display">
            <div class="example-header">
              <div class="example-title-section">
                <h3>{{ currentExample()?.title }}</h3>
                @if (availableExamples().length > 1) {
                  <div class="example-counter">
                    <span class="counter-text">{{ currentExampleIndex() + 1 }} of {{ availableExamples().length }}</span>
                  </div>
                }
              </div>
              @if (currentExample()?.description) {
                <p class="example-description">{{ currentExample()?.description }}</p>
              }
            </div>
            
            @if (availableExamples().length > 1) {
              <div class="example-navigation">
                <p-button 
                  icon="pi pi-chevron-left" 
                  label="Previous"
                  severity="secondary"
                  size="small"
                  [disabled]="currentExampleIndex() === 0"
                  (onClick)="navigateToPrevious()"
                  class="nav-button"
                />
                <div class="nav-info">
                  <span class="nav-title">{{ currentExample()?.title }}</span>
                </div>
                <p-button 
                  icon="pi pi-chevron-right" 
                  label="Next"
                  severity="secondary"
                  size="small"
                  [disabled]="currentExampleIndex() === availableExamples().length - 1"
                  (onClick)="navigateToNext()"
                  class="nav-button"
                />
              </div>
            }
            
            <div class="example-demo">
              <h4>Live Demo</h4>
              <div class="demo-container">
                <ng-container [ngComponentOutlet]="currentExample()?.component" />
              </div>
            </div>
            
            @if (currentExample()?.code) {
              <div class="example-code">
                <h4>Code</h4>
                <pre><code>{{ currentExample()?.code }}</code></pre>
              </div>
            }
          </div>
        } @else {
          <div class="no-example">
            <p>Example not found</p>
          </div>
        }
      </div>
      
      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <div class="footer-navigation">
            @if (availableExamples().length > 1) {
              <div class="footer-nav-buttons">
                <p-button 
                  icon="pi pi-chevron-left"
                  severity="secondary"
                  size="small"
                  [text]="true"
                  [disabled]="currentExampleIndex() === 0"
                  (onClick)="navigateToPrevious()"
                  pTooltip="Previous example"
                  tooltipPosition="top"
                />
                <span class="footer-counter">{{ currentExampleIndex() + 1 }} / {{ availableExamples().length }}</span>
                <p-button 
                  icon="pi pi-chevron-right"
                  severity="secondary"
                  size="small"
                  [text]="true"
                  [disabled]="currentExampleIndex() === availableExamples().length - 1"
                  (onClick)="navigateToNext()"
                  pTooltip="Next example"
                  tooltipPosition="top"
                />
              </div>
            }
          </div>
          <p-button 
            label="Close" 
            icon="pi pi-times" 
            severity="secondary"
            (onClick)="closeDialog()"
          />
        </div>
      </ng-template>
    </p-dialog>
  `,
  styleUrls: ['./example-dialog.component.scss'],
  imports: [
    DialogModule, 
    ButtonModule, 
    AccordionModule, 
    TooltipModule,
    CommonModule,
    WelcomeButtonExampleComponent,
    BasicDiscardExampleComponent,
    ConfirmationDiscardExampleComponent
  ]
})
export class ExampleDialogComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialogService = inject(ExampleDialogService);
  private destroyRef = inject(DestroyRef);
  
  isVisible = signal(false);
  currentExample = signal<ExampleItem | null>(null);
  currentExampleIndex = signal(0);
  dialogTitle = signal('Interactive Example');
  
  availableExamples = computed(() => this.dialogService.examples());
  
  ngOnInit() {
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
  
  openExample(exampleId: string) {
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
  
  navigateToPrevious() {
    const currentIndex = this.currentExampleIndex();
    const examples = this.availableExamples();
    
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newExample = examples[newIndex];
      this.setCurrentExample(newExample, newIndex);
    }
  }
  
  navigateToNext() {
    const currentIndex = this.currentExampleIndex();
    const examples = this.availableExamples();
    
    if (currentIndex < examples.length - 1) {
      const newIndex = currentIndex + 1;
      const newExample = examples[newIndex];
      this.setCurrentExample(newExample, newIndex);
    }
  }
  
  private setCurrentExample(example: ExampleItem, index: number) {
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
  
  closeDialog() {
    this.isVisible.set(false);
    this.currentExample.set(null);
    this.currentExampleIndex.set(0);
    this.dialogService.closeExample();
  }
  
  private getExampleId(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
} 