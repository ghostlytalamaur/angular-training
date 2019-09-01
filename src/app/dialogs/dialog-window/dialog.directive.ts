import { Directive, HostBinding, HostListener, Inject } from '@angular/core';
import { DIALOG_CONTROLLER, DialogController } from './dialog-controller';

@Directive({
  selector: '[appDlgClose]'
})
export class DialogCloseDirective {

  constructor(
    @Inject(DIALOG_CONTROLLER) private readonly controller: DialogController
  ) {
  }

  @HostListener('click')
  closeDialog() {
    setTimeout(() => this.controller.close(), 0);
  }
}

@Directive({
  selector: '[appDlgContent], app-dialog-content'
})
export class DialogContentDirective {
  @HostBinding('class')
  contentClass = 'app-dialog-content';
}
