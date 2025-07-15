import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-confirmation-discard-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" class="flex flex-column gap-3">
      <div class="field">
        <label for="title">Title</label>
        <input id="title" pInputText formControlName="title" class="w-full" />
      </div>
      <div class="field">
        <label for="content">Content</label>
        <textarea id="content" pInputTextarea formControlName="content" class="w-full" rows="4"></textarea>
      </div>
      <div class="flex gap-2">
        <p-button label="Save" severity="success" />
        <p-button 
          label="Discard Changes" 
          severity="danger" 
          (click)="discardChanges()" 
          [disabled]="!form.dirty"
        />
      </div>
      @if (discarded()) {
        <p class="text-green-600">✅ Changes discarded successfully</p>
      }
    </form>
    <p-confirmDialog />
  `,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, InputTextarea, ConfirmDialogModule],
  providers: [ConfirmationService]
})
export class ConfirmationDiscardExampleComponent {
  private fb = new FormBuilder();
  private confirmationService = inject(ConfirmationService);
  private originalValue = { title: 'Sample Article', content: 'This is sample content...' };
  
  discarded = signal(false);
  
  form = this.fb.group({
    title: [this.originalValue.title, Validators.required],
    content: [this.originalValue.content]
  });
  
  discardChanges(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to discard your changes? This action cannot be undone.',
      header: 'Discard Changes',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.form.patchValue(this.originalValue);
        this.form.markAsPristine();
        this.discarded.set(true);
        setTimeout(() => this.discarded.set(false), 3000);
      }
    });
  }
} 