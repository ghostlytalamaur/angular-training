import { DialogController } from './dialog-window/dialog-controller';

// public version of DialogController
export class DialogRef<C> {

  constructor(
    private controller: DialogController,
  ) {
  }

  close(): void {
    this.controller.close();
  }

}
