import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DIALOG_CONFIG, DialogConfig } from '../dialog-config';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DIALOG_CONTROLLER, DialogController } from './dialog-controller';
import { DialogInterface } from './dialog-interface';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DialogWindowComponent implements OnInit, OnDestroy, DialogInterface {

  @ViewChild('dragHandle', { static: true })
  dragHandle: ElementRef<HTMLElement>;

  @HostBinding('class.app-dialog-window-dragged')
  isDragged: boolean;

  @HostBinding('class.app-dialog-window-draggable')
  draggable: boolean;

  @HostBinding('class.app-dialog-window-maximized')
  maximized: boolean;

  private alive$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(DIALOG_CONTROLLER) private readonly controller: DialogController,
    @Inject(DIALOG_CONFIG) public readonly config: DialogConfig<any>,
  ) {
  }

  ngOnInit() {
    this.controller.maximized$
      .pipe(takeUntil(this.alive$))
      .subscribe(isMaximized => this.maximized = isMaximized);

    this.controller.draggable$
      .pipe(takeUntil(this.alive$))
      .subscribe(isDraggable => this.draggable = isDraggable);
    this.controller.dragged$
      .pipe(takeUntil(this.alive$))
      .subscribe(isDragged => this.isDragged = isDragged);
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }

  onMaximise(): void {
    this.controller.toggleMaximize();
  }

  getDragHandle(): ElementRef<HTMLElement> {
    return this.dragHandle;
  }
}
