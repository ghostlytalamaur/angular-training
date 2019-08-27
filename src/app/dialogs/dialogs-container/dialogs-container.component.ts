import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import { PortalInjector } from '@angular/cdk/portal';
import { DialogController, DialogRef } from '../dialog-ref';
import { DialogConfig } from '../dialog-config';
import { DIALOG_CONFIG, DIALOG_CONTROLLER, DialogWindowComponent } from '../dialog-window/dialog-window.component';

@Component({
  templateUrl: './dialogs-container.component.html',
  styleUrls: ['./dialogs-container.component.scss']
})
export class DialogsContainerComponent implements OnInit, OnDestroy {

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;
  private dialogsMap: Map<string, ComponentRef<any>>;
  private counter = 0;
  private stack: string[] = [];

  constructor(
    private readonly factoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector,
    private readonly renderer2: Renderer2
  ) {
    this.dialogsMap = new Map<string, ComponentRef<any>>();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    for (const dialogId of this.dialogsMap.keys()) {
      this.closeDialog(dialogId);
    }
    this.dialogsMap.clear();
  }

  openDialog<C>(config: DialogConfig<C>): DialogRef<C> {
    console.log(this.viewContainerRef);
    const factory = this.factoryResolver.resolveComponentFactory(DialogWindowComponent);
    const id = this.generateNewDialogId();
    const controller = this.createController(id);
    const dialogRef = new DialogRef<C>(controller);
    const dialogInjector = this.createInjector(config, controller);

    const componentRef = this.viewContainerRef.createComponent(factory, undefined, dialogInjector);
    this.dialogCreated(id, componentRef);

    return dialogRef;
  }

  closeDialog(dialogId: string) {
    const viewRef = this.getViewRef(dialogId);
    if (!viewRef) {
      return;
    }

    const index = this.viewContainerRef.indexOf(viewRef);
    if (index >= 0) {
      this.viewContainerRef.remove(index);
    }
  }

  private bringToFront(dialogId: string) {
    const newStack: string[] = [];
    newStack.push(dialogId);
    for (const otherDialogId of this.stack) {
      if (otherDialogId !== dialogId) {
        newStack.push(otherDialogId);
      }
    }

    const len = newStack.length;
    for (const [index, id] of newStack.entries()) {
      const componentRef = this.getDialog(id);
      if (componentRef) {
        this.renderer2.setStyle(componentRef.location.nativeElement, 'z-index', len - index);
      }
    }
    this.stack = newStack;
  }

  private dialogCreated(dialogId: string, componentRef: ComponentRef<unknown>) {
    console.log(`dialogCreated, id = ${dialogId}`);
    this.dialogsMap.set(dialogId, componentRef);
    componentRef.hostView.onDestroy(() => this.dialogDestroyed(dialogId));
    this.bringToFront(dialogId);
  }

  private dialogDestroyed(dialogId: string) {
    console.log(`dialogDestroyed, id = ${dialogId}`);
    this.dialogsMap.delete(dialogId);
    const index = this.stack.indexOf(dialogId);
    if (index >= 0) {
      this.stack.splice(index, 1);
    }
  }

  private getDialog(dialogId: string): ComponentRef<any> | undefined {
    return this.dialogsMap.get(dialogId);
  }

  private getViewRef(dialogId: string): ViewRef | undefined {
    const componentRef = this.getDialog(dialogId);
    return componentRef && componentRef.hostView;
  }

  private generateNewDialogId(): string {
    this.counter++;
    return `dialog_${this.counter}`;
  }

  private createInjector<C>(config: DialogConfig<C>, controller: DialogController): Injector {
    const tokens = new WeakMap<any, unknown>();
    tokens.set(DIALOG_CONTROLLER, controller);
    tokens.set(DIALOG_CONFIG, config);
    return new PortalInjector(config.injector || this.injector, tokens);
  }

  private createController(dialogId: string): DialogController {
    return {
      close: () => this.closeDialog(dialogId),
      bringToFront: () => this.bringToFront(dialogId)
    };
  }
}
