import { DialogInterface } from './dialog-interface';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { map } from 'rxjs/operators';
import { InjectionToken } from '@angular/core';

export interface DialogsContainerRef {
  bringToFront(id: string): void;

  dialogCreated(id: string, controller: DialogController): void;

  dialogDestroyed(id: string): void;
}

export class DialogController {

  public readonly dragged$: Observable<boolean>;
  public readonly maximized$: Observable<boolean>;
  public readonly draggable$: Observable<boolean>;

  private dialog: DialogInterface | undefined;
  private overlayRef: OverlayRef | undefined;
  private dragRef: DragRef<any> | undefined;
  private storedPos: { x: number; y: number };
  private readonly maximized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subscription: Subscription | undefined;

  private readonly draggable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly id: string,
    private readonly container: DialogsContainerRef,
    overlayRef: OverlayRef,
    private readonly dragDrop: DragDrop
  ) {
    this.maximized$ = this.maximized.asObservable();
    this.draggable$ = this.draggable.asObservable();
    this.overlayRef = overlayRef;
    this.subscription = this.overlayRef.detachments()
      .subscribe(() => this.dispose());

    this.dragRef = this.dragDrop.createDrag(this.overlayRef.overlayElement)
      .withBoundaryElement(this.overlayRef.hostElement);

    this.dragged$ = merge(
      this.dragRef.started.pipe(map(() => true)),
      this.dragRef.ended.pipe(map(() => false))
    );
    this.draggable.next(true);

    this.overlayRef.overlayElement.addEventListener('mousedown', () => this.bringToFront());
  }

  attachDialog(dialog: DialogInterface): void {
    if (this.dialog) {
      throw new Error('Dialog already attached');
    }
    this.dialog = dialog;
    if (this.dragRef) {
      this.dragRef.withHandles([dialog.getDragHandle()]);
    }
    this.container.dialogCreated(this.id, this);
  }

  maximize(): void {
    if (!this.overlayRef || !this.dialog || !this.dragRef) {
      throw new Error(`Dialog ${this.id} already disposed`);
    }

    if (this.maximized.value) {
      return;
    }
    this.storedPos = this.dragRef.getFreeDragPosition();
    this.dragRef.disableHandle(this.dialog.getDragHandle().nativeElement);
    this.dragRef.reset();
    this.overlayRef.updateSize({
      width: '100%',
      height: '100%'
    });
    this.draggable.next(false);
    this.maximized.next(true);
  }

  restore(): void {
    if (!this.overlayRef || !this.dialog || !this.dragRef) {
      throw new Error(`Dialog ${this.id} already disposed`);
    }

    if (!this.maximized.value) {
      return;
    }

    this.dragRef.enableHandle(this.dialog.getDragHandle().nativeElement);
    this.dragRef.setFreeDragPosition(this.storedPos);
    this.overlayRef.updateSize({
      width: undefined,
      height: undefined
    });
    this.draggable.next(true);
    this.maximized.next(false);
  }

  toggleMaximize(): void {
    if (this.maximized.value) {
      this.restore();
    } else {
      this.maximize();
    }
  }

  setZIndex(zIndex: number): void {
    if (!this.overlayRef) {
      throw new Error(`Dialog ${this.id} already disposed`);
    }

    this.overlayRef.hostElement.style.zIndex = zIndex.toString();
  }

  close(): void {
    if (!this.overlayRef) {
      throw new Error(`Dialog ${this.id} already disposed`);
    }
    this.overlayRef.dispose();
  }

  bringToFront(): void {
    this.container.bringToFront(this.id);
  }

  private dispose(): void {
    if (this.dragRef) {
      this.dragRef.dispose();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = undefined;
    this.dialog = undefined;
    this.overlayRef = undefined;
    this.dragRef = undefined;
    this.container.dialogDestroyed(this.id);
  }

}

export const DIALOG_CONTROLLER = new InjectionToken<DialogController>('dialog-controller');
