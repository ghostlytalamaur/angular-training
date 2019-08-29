import { DialogController } from '../dialog-controller';

export class DialogsContainerService {
  private dialogsMap: Map<string, DialogController>;
  private stack: string[] = [];

  constructor() {
    this.dialogsMap = new Map<string, DialogController>();
  }

  closeAll(): void {
    if (this.dialogsMap.size === 0) {
      return;
    }
    for (const dialogId of this.dialogsMap.keys()) {
      this.closeDialog(dialogId);
    }
    this.dialogsMap.clear();
  }

  closeDialog(dialogId: string) {
    const dialog = this.getDialog(dialogId);
    if (dialog) {
      dialog.close();
    }
  }

  bringToFront(dialogId: string) {
    const newStack: string[] = [];
    newStack.push(dialogId);
    for (const otherDialogId of this.stack) {
      if (otherDialogId !== dialogId) {
        newStack.push(otherDialogId);
      }
    }

    const len = newStack.length;
    for (const [index, id] of newStack.entries()) {
      const dialog = this.getDialog(id);
      if (dialog) {
        dialog.setZIndex(len - index);
      }
    }
    this.stack = newStack;
  }


  dialogCreated(dialogId: string, controller: DialogController) {
    console.log(`dialogCreated, id = ${dialogId}`);
    this.dialogsMap.set(dialogId, controller);
    this.bringToFront(dialogId);
  }

  dialogDestroyed(dialogId: string) {
    console.log(`dialogDestroyed, id = ${dialogId}`);
    this.dialogsMap.delete(dialogId);
    const index = this.stack.indexOf(dialogId);
    if (index >= 0) {
      this.stack.splice(index, 1);
    }
  }

  getDialog(dialogId: string): DialogController | undefined {
    return this.dialogsMap.get(dialogId);
  }

}
