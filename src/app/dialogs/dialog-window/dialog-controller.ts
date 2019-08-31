import { Renderer2, ViewRef } from '@angular/core';
import { DialogsContainerService } from '../dialogs-container/dialogs-container.service';
import { DialogInterface } from './dialog-interface';
import { BehaviorSubject, Observable } from 'rxjs';

export class DialogController {
  private dialog: DialogInterface | undefined;
  private hostView: ViewRef | undefined;
  private storedPos: { x: number, y: number };
  private readonly maximized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly maximized$: Observable<boolean> = this.maximized.asObservable();

  constructor(
    private readonly id: string,
    private readonly renderer2: Renderer2,
    private readonly dialogs: DialogsContainerService,
  ) {
  }

  attachDialog(dialog: DialogInterface, hostView: ViewRef): void {
    if (this.dialog) {
      throw new Error('Dialog already attached');
    }
    this.dialog = dialog;
    this.hostView = hostView;
    this.hostView.onDestroy(() => this.detachDialog());
    this.dialogs.dialogCreated(this.id, this);
  }

  private detachDialog(): void {
    this.dialog = undefined;
    this.hostView = undefined;
    this.dialogs.dialogDestroyed(this.id);
  }

  maximize(): void {
    if (!this.dialog || this.maximized.value) {
      return;
    }
    this.storedPos = this.dialog.getPosition();
    this.dialog.resetPosition();
    this.dialog.disableDrag();
    this.maximized.next(true);
  }

  restore(): void {
    if (!this.dialog || !this.maximized.value) {
      return;
    }

    this.dialog.setPosition(this.storedPos);
    this.dialog.enableDrag();
    this.maximized.next(false);
  }

  toggleMaximize(): void {
    if (!this.dialog) {
      return;
    }

    if (this.dialog.getMaximized()) {
      this.restore();
    } else {
      this.maximize();
    }
  }

  setZIndex(zIndex: number): void {
    if (this.dialog) {
      this.dialog.setZIndex(zIndex);
    }
  }

  close(): void {
    if (this.hostView) {
      this.hostView.destroy();
    }
  }

  bringToFront(): void {
    this.dialogs.bringToFront(this.id);
  }

}
