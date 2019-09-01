import { ElementRef } from '@angular/core';

export interface DialogInterface {
  getDragHandle(): ElementRef<HTMLElement>;
}
