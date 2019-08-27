import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  OnDestroy,
  OnInit,
  Renderer2,
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
export class DialogWindowComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('dragHandle', { static: true })
  dragHandle: ElementRef<HTMLElement>;
  @HostBinding('class.dragged')
  isDragged: boolean;
  private alive$: Subject<void> = new Subject<void>();
  private dragRef: DragRef<any>;

  constructor(
    private readonly dragDrop: DragDrop,
    private readonly hostRef: ElementRef,
    private readonly renderer2: Renderer2,
    private readonly elementRef: ElementRef,
    @Inject(DIALOG_CONTROLLER) private readonly controller: DialogController,
    @Inject(DIALOG_CONFIG) private readonly config: DialogConfig<any>
  ) {
  }

  ngOnInit() {
    this.initDragDrop();
  }

  ngAfterViewInit(): void {
    this.moveToCenter();
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

  private initDragDrop(): void {
    const parent = this.renderer2.parentNode(this.elementRef.nativeElement) as HTMLElement;
    this.dragRef = this.dragDrop.createDrag(this.hostRef)
      .withHandles([this.dragHandle])
      .withBoundaryElement(parent);

    this.dragRef.started
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(() => this.isDragged = true);
    this.dragRef.ended
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(() => this.isDragged = false);
  }

  private moveToCenter(): void {
    const parent = this.renderer2.parentNode(this.elementRef.nativeElement) as HTMLElement;
    const rect = parent.getBoundingClientRect();
    const dialogRect = (this.elementRef.nativeElement as HTMLElement).getBoundingClientRect();
    const x = rect.width / 2 - dialogRect.width / 2;
    const y = rect.height / 2 - dialogRect.height / 2;
    this.dragRef.setFreeDragPosition({ x, y });
  }
}
