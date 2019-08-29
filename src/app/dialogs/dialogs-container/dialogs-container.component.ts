import { Component, ComponentFactoryResolver, Injector, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { PortalInjector } from '@angular/cdk/portal';
import { DialogConfig } from '../dialog-config';
import { DIALOG_CONFIG, DIALOG_CONTROLLER, DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { DialogRef } from '../dialog-ref';
import { DialogController } from '../dialog-controller';
import { DialogsContainerService } from './dialogs-container.service';

@Component({
  templateUrl: './dialogs-container.component.html',
  styleUrls: ['./dialogs-container.component.scss'],
  providers: [DialogsContainerService]
})
export class DialogsContainerComponent {

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;
  private counter = 0;

  constructor(
    private readonly factoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector,
    private readonly renderer2: Renderer2,
    private readonly dialogs: DialogsContainerService
  ) {
  }

  openDialog<C>(config: DialogConfig<C>): DialogRef<C> {
    const factory = this.factoryResolver.resolveComponentFactory(DialogWindowComponent);
    const id = this.generateNewDialogId();
    const controller = this.createController(id);
    const dialogRef = new DialogRef<C>(controller);
    const dialogInjector = this.createInjector(config, dialogRef, controller);

    const componentRef = this.viewContainerRef.createComponent(factory, undefined, dialogInjector);
    controller.attachDialog(componentRef.instance, componentRef.hostView);

    return dialogRef;
  }

  private createInjector<C>(config: DialogConfig<C>, dialogRef: DialogRef<C>, controller: DialogController): Injector {
    const tokens = new WeakMap<any, unknown>();
    tokens.set(DIALOG_CONTROLLER, controller);
    tokens.set(DIALOG_CONFIG, config);
    tokens.set(DialogRef, dialogRef);
    return new PortalInjector(config.injector || this.injector, tokens);
  }

  private createController(dialogId: string): DialogController {
    return new DialogController(dialogId, this.renderer2, this.dialogs);
  }

  private generateNewDialogId(): string {
    this.counter++;
    return `dialog_${this.counter}`;
  }
}
