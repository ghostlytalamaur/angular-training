import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

export interface DataValue {
  value: string;
}

@Component({
  selector: 'app-async-pipe-child-component',
  templateUrl: './async-pipe-child-component.component.html',
  styleUrls: ['./async-pipe-child-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncPipeChildComponentComponent implements OnInit, OnChanges {

  @Input()
  public caption: string;

  @Input()
  public data: DataValue;

  constructor() { }

  ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes in', this.caption, changes);
  }

}
