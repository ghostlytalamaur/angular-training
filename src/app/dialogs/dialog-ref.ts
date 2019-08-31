import { DialogController } from './dialog-window/dialog-controller';

// public version of DialogController
export class DialogRef<C> {

  constructor(
    private controller: DialogController,
  ) {
  }

  maximize(): void {
    this.controller.maximize();
  }

  restore(): void {
    this.controller.restore();
  }

  toggleMaximize(): void {
    this.controller.toggleMaximize();
  }

  close(): void {
    this.controller.close();
  }

  bringToFront(): void {
    this.controller.bringToFront();
  }

}
