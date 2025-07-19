import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';

@Component({
  selector: 'app-basic-discard-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" class="flex flex-column gap-3">
      <div class="field">
        <label for="name">Name</label>
        <input id="name" pInputText formControlName="name" class="w-full" />
      </div>
      <div class="field">
        <label for="description">Description</label>
        <textarea
          id="description"
          pInputTextarea
          formControlName="description"
          class="w-full"
        ></textarea>
      </div>
      <div class="flex gap-2">
        <p-button label="Save" severity="success" />
        <p-button
          label="Discard Changes"
          severity="secondary"
          (click)="discardChanges()"
          [disabled]="!form.dirty"
        />
      </div>
      @if (form.dirty) {
        <p class="text-orange-600">⚠️ You have unsaved changes</p>
      }
    </form>
  `,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, InputTextarea],
})
export class BasicDiscardExampleComponent {
  private fb = new FormBuilder();
  private originalValue = { name: 'John Doe', description: 'Sample description' };

  form = this.fb.group({
    name: [this.originalValue.name, Validators.required],
    description: [this.originalValue.description],
  });

  discardChanges(): void {
    this.form.patchValue(this.originalValue);
    this.form.markAsPristine();
  }
}
