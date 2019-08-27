import { Injectable } from '@angular/core';

export interface DialogController {
  close(): void;

  bringToFront(): void;
}

@Injectable()
export class DialogRef<C> {
  constructor(
    private readonly controller: DialogController,
  ) {
  }

  close(): void {
    this.controller.close();
  }
}
