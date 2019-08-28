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
import { DialogController } from '../dialog-ref';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { DialogConfig } from '../dialog-config';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Point } from '@angular/cdk/drag-drop/typings/drag-ref';

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
  @HostBinding('class.draggable')
  draggable: boolean;
  @HostBinding('class.maximized')
  maximized: boolean;
  @ViewChild('viewContainer', { static: true, read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;
  component: ComponentRef<any>;

  private alive$: Subject<void> = new Subject<void>();
  private dragRef: DragRef<any>;
  private storedPos: Readonly<Point>;

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

  onClose(): void {
    this.controller.close();
  }

  onMaximise(): void {
    console.log(this.component);
    this.maximized = !this.maximized;
    if (this.maximized) {
      this.storedPos = this.dragRef.getFreeDragPosition();
      this.dragRef.reset();
      this.disableDrag();
      this.renderer2.addClass(this.component.location.nativeElement, 'maximized');
    } else {
      this.renderer2.removeClass(this.component.location.nativeElement, 'maximized');
      this.enableDrag();
      this.dragRef.setFreeDragPosition(this.storedPos);
    }
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

  private enableDrag(): void {
    this.dragRef.enableHandle(this.dragHandle.nativeElement);
    this.draggable = true;
  }

  private disableDrag(): void {
    this.dragRef.disableHandle(this.dragHandle.nativeElement);
    this.draggable = false;
  }
}
