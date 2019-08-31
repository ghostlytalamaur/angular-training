import { Directive, HostBinding, HostListener } from '@angular/core';
import { DialogRef } from '../dialog-ref';

@Directive({
  selector: '[appDlgClose]'
})
export class DialogCloseDirective {

  constructor(
    private readonly dlgRef: DialogRef<any>
  ) {
  }

  @HostListener('click')
  closeDialog() {
    setTimeout(() => this.dlgRef.close(), 0);
  }
}

@Directive({
  selector: '[appDlgContent], app-dialog-content'
})
export class DialogContentDirective {
  @HostBinding('class')
  contentClass = 'app-dialog-content';
}
