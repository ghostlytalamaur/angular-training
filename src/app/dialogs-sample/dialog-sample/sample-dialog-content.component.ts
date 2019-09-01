import { Component, OnDestroy, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  template: `
      <app-dialog>
          <app-dialog-content>
              <p>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
                  corrupti
                  quos
                  dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia
                  deserunt
                  mollitia animi, id est laborum et dolorum fuga.
                  <br/>
                  <br/>
                  Et harum quidem rerum facilis est et expedita distinctio.
                  <br/>
                  <br/>
                  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere
                  possimus,
                  omnis voluptas assumenda est, omnis dolor repellendus.
                  <br/>
                  <br/>
                  Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae
                  sint
                  et molestiae non recusandae.
                  <br/>
                  <br/>
                  Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut
                  perferendis
                  doloribus asperiores repellat.
              </p>
          </app-dialog-content>

          <app-dialog-actions>
              <button mat-flat-button (click)="onShowMatDialog(tmpl)">Show MatDialog</button>
              <button mat-flat-button (click)="onCancel()" appDlgClose color="warn">Cancel</button>
          </app-dialog-actions>
      </app-dialog>

      <ng-template #tmpl>
          <p>Hello from MatDialog!</p>
      </ng-template>
  `,
  styleUrls: ['sample-dialog-content.component.scss']
})
export class SampleDialogContentComponent implements OnDestroy {

  constructor(
    private readonly dialog: MatDialog
  ) {
  }

  onCancel(): void {
    console.log('Cancel button clicked');
  }

  onShowMatDialog(tmpl: TemplateRef<any>): void {
    this.dialog.open(tmpl);
  }

  ngOnDestroy(): void {
    console.log('Component destroyed');
  }
}
