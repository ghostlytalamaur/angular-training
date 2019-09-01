import { Component, OnInit } from '@angular/core';
import { DialogsService } from '../../dialogs/dialogs.service';
import { SampleDialogContentComponent } from './sample-dialog-content.component';
import { DialogConfig } from '../../dialogs/dialog-config';

@Component({
  selector: 'app-sample',
  templateUrl: './dialog-window-sample.component.html',
  styleUrls: ['./dialog-window-sample.component.scss']
})
export class DialogWindowSampleComponent implements OnInit {

  config: DialogConfig<SampleDialogContentComponent> = {
    title: 'Sample Dialog',
    component: SampleDialogContentComponent
  };

  constructor(
    private readonly dialog: DialogsService
  ) {
  }

  ngOnInit() {
  }

  onOpenDialog(): void {
    this.dialog.open(this.config);
  }
}
