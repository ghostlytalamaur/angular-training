import { Directive, HostListener } from '@angular/core';
import { DialogRef } from '../dialog-ref';

@Directive({
  selector: '[appDlgClose]'
})
export class DialogCloseDirective {

  constructor(
    private readonly dlgRef: DialogRef<any>
  ) {}

  @HostListener('click')
  closeDialog() {
    console.log('Close dialog window through directive');
    this.dlgRef.close();
    console.log('Dialog closed through directive');
  }
}
