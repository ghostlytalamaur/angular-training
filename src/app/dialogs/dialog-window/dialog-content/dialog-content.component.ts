import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { DialogRef } from '../../dialog-ref';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss']
})
export class DialogContentComponent implements OnInit, OnDestroy {

  @HostBinding('class.maximized')
  maximized: boolean;
  private readonly alive$: Subject<void>;

  constructor(
    private readonly dialogRef: DialogRef<any>
  ) {
    this.alive$ = new Subject<void>();
  }

  ngOnInit() {
    // this.dialogRef.maximized$
    //   .pipe(
    //     takeUntil(this.alive$)
    //   )
    //   .subscribe(maximized => this.maximized = maximized);
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }

}
