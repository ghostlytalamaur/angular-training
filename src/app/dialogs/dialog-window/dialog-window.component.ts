import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { DialogController } from '../dialog-ref';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { DialogConfig } from '../dialog-config';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export const DIALOG_CONFIG = new InjectionToken('dialog-config');
export const DIALOG_CONTROLLER = new InjectionToken('dialog-controller');

@Component({
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogWindowComponent implements OnInit, OnDestroy {

  @ViewChild('dragHandle', { static: true })
  dragHandle: ElementRef<HTMLElement>;
  @HostBinding('class.dragged')
  isDragged: boolean;
  private alive$: Subject<void> = new Subject<void>();

  constructor(
    private readonly dragDrop: DragDrop,
    private readonly hostRef: ElementRef,
    @Inject(DIALOG_CONTROLLER) private readonly controller: DialogController,
    @Inject(DIALOG_CONFIG) private readonly config: DialogConfig<any>
  ) {
  }

  ngOnInit() {
    const dragRef: DragRef = this.dragDrop.createDrag(this.hostRef)
      .withHandles([this.dragHandle]);

    dragRef.started
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(() => this.isDragged = true);
    dragRef.ended
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(() => this.isDragged = false);
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }

  @HostListener('mousedown')
  onHostClick(): void {
    this.controller.bringToFront();
  }

  onClose(): void {
    this.controller.close();
  }

}
