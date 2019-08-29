import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { DialogConfig } from '../dialog-config';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Point } from '@angular/cdk/drag-drop/typings/drag-ref';
import { DialogController } from '../dialog-controller';
import { DialogInterface } from './dialog-interface';

export const DIALOG_CONFIG = new InjectionToken('dialog-config');
export const DIALOG_CONTROLLER = new InjectionToken('dialog-controller');

@Component({
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogWindowComponent implements OnInit, OnDestroy, AfterViewInit, DialogInterface {

  @ViewChild('dragHandle', { static: true })
  dragHandle: ElementRef<HTMLElement>;
  @HostBinding('class.dragged')
  isDragged: boolean;
  @HostBinding('class.draggable')
  draggable: boolean;
  @HostBinding('class.maximized')
  maximized: boolean;
  @HostBinding('style.z-index')
  zIndex: number;
  @ViewChild('viewContainer', { static: true, read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;
  component: ComponentRef<any>;

  private alive$: Subject<void> = new Subject<void>();
  dragRef: DragRef<any>;

  constructor(
    private readonly dragDrop: DragDrop,
    private readonly hostRef: ElementRef,
    private readonly renderer2: Renderer2,
    private readonly elementRef: ElementRef,
    private readonly factoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector,
    @Inject(DIALOG_CONTROLLER) private readonly controller: DialogController,
    @Inject(DIALOG_CONFIG) private readonly config: DialogConfig<any>
  ) {
  }

  ngOnInit() {
    const factory = this.factoryResolver.resolveComponentFactory(this.config.component);
    this.component = this.viewContainerRef.createComponent(factory, undefined, this.injector);

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

  onMaximise(): void {
    this.controller.toggleMaximize();
  }

  private moveToCenter(): void {
    const parent = this.renderer2.parentNode(this.elementRef.nativeElement) as HTMLElement;
    const rect = parent.getBoundingClientRect();
    const dialogRect = (this.elementRef.nativeElement as HTMLElement).getBoundingClientRect();
    const x = rect.width / 2 - dialogRect.width / 2;
    const y = rect.height / 2 - dialogRect.height / 2;
    this.dragRef.setFreeDragPosition({ x, y });
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

    this.enableDrag();
  }

  enableDrag(): void {
    this.dragRef.enableHandle(this.dragHandle.nativeElement);
    this.draggable = true;
  }

  disableDrag(): void {
    this.dragRef.disableHandle(this.dragHandle.nativeElement);
    this.draggable = false;
  }

  getPosition(): Point {
    return this.dragRef.getFreeDragPosition();
  }

  setPosition(newPos: Point): void {
    this.dragRef.setFreeDragPosition(newPos);
  }

  resetPosition(): void {
    this.dragRef.reset();
  }

  setZIndex(zIndex: number): void {
    this.zIndex = zIndex;
  }

  setMaximized(isMaximized: boolean): void {
    this.maximized = isMaximized;
  }

  getMaximized(): boolean {
    return this.maximized;
  }
}
