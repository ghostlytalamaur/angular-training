import { ChangeDetectionStrategy, Component, HostBinding, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogController } from '../dialog-controller';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DIALOG_CONTROLLER } from '../dialog-window.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit, OnDestroy {

  @HostBinding('class.app-dialog-maximized')
  maximized: boolean;
  private readonly alive$ = new Subject<void>();

  constructor(
    @Inject(DIALOG_CONTROLLER) private readonly controller: DialogController
  ) {
  }

  ngOnInit(): void {
    this.controller.maximized$
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(
        isMaximized => this.maximized = isMaximized
      );
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }
}
