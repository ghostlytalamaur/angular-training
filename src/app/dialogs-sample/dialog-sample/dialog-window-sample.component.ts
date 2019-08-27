import { Component, OnInit } from '@angular/core';
import { DialogsService } from '../../dialogs/dialogs.service';
import { SampleDialogContentComponent } from './sample-dialog-content.component';

@Component({
  selector: 'app-sample',
  templateUrl: './dialog-window-sample.component.html',
  styleUrls: ['./dialog-window-sample.component.scss']
})
export class DialogWindowSampleComponent implements OnInit {

  constructor(
    private readonly dialog: DialogsService
  ) {
  }

  ngOnInit() {
  }

  onOpenDialog(): void {
    this.dialog.open({
      title: 'Sample dialog',
      component: SampleDialogContentComponent
    });
  }
}
