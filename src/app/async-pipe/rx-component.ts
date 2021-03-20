import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// TODO: Add Angular decorator.
export class RxComponent implements OnDestroy {

  protected readonly destroy$ = new Subject<void>();

  public constructor() {
    const fn = this.ngOnDestroy;
    this.ngOnDestroy = () => {
      fn();
      this.cleanupSubscriptions();
    };
  }
  public ngOnDestroy(): void {
  }

  private cleanupSubscriptions(): void {
    this.destroy$.next();
    this.destroy$.complete();
    console.log('unsubscribed');
  }
}
