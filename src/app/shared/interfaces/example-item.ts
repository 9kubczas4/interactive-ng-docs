import { Type } from '@angular/core';

export interface ExampleItem {
  title: string;
  description: string;
  component: Type<unknown>;
  code: string;
}
