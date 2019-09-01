import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Injectable, Injector } from '@angular/core';
import { DialogRef } from './dialog-ref';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { DIALOG_CONFIG, DialogConfig } from './dialog-config';
import { DialogWindowComponent } from './dialog-window/dialog-window.component';
import { DIALOG_CONTROLLER, DialogController } from './dialog-window/dialog-controller';
import { DragDrop } from '@angular/cdk/drag-drop';
import { DialogsContainer } from './dialogs-container';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  private dlgCount = 0;
  private readonly container: DialogsContainer;
  constructor(
    private readonly overlay: Overlay,
    private readonly injector: Injector,
    private readonly dragDrop: DragDrop
  ) {
    this.container = new DialogsContainer();
  }

  open<C>(config: DialogConfig<C>): DialogRef<C> {
    const overlayRef = this.overlay.create(this.getOverlayConfig());
    const controller = new DialogController('app-dialog-' + ++this.dlgCount, this.container, overlayRef, this.dragDrop);

    const injector = this.createInjector(config, controller);
    const compRef = overlayRef.attach(new ComponentPortal(DialogWindowComponent, null, injector));
    controller.attachDialog(compRef.instance);
    return new DialogRef(controller);
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: false,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private createInjector(config: DialogConfig<any>, controller: DialogController): Injector {
    const tokens = new WeakMap();
    tokens.set(DIALOG_CONFIG, config);
    tokens.set(DIALOG_CONTROLLER, controller);
    return new PortalInjector(config.injector || this.injector, tokens);
  }
}
