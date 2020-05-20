import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, interval, of, Subscription } from 'rxjs';
import { DataValue } from '../async-pipe-child-component/async-pipe-child-component.component';
import { switchMap, map, delay } from 'rxjs/operators';
import { RxComponent } from '../rx-component';

@Component({
  selector: 'app-async-pipe-component',
  templateUrl: './async-pipe-component.component.html',
  styleUrls: ['./async-pipe-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncPipeComponentComponent extends RxComponent implements OnInit, OnDestroy {

  public singleStream$: Observable<DataValue>;
  public data$: Observable<DataValue>;
  private subscription = Subscription.EMPTY;

  ngOnInit(): void {
    this.singleStream$ = interval(1000)
      .pipe(
        switchMap(() => of({ value: new Date().toISOString() })),
      );

    this.subscription = interval(1000)
      .pipe(
        map(() => ({ value: new Date().toISOString() })),
      )
      .subscribe(value => {
        this.data$ = of(value).pipe(delay(300));
      })
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
