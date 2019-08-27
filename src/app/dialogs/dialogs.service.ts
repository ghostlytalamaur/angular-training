import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef, Injectable } from '@angular/core';
import { DialogRef } from './dialog-ref';
import { ComponentPortal } from '@angular/cdk/portal';
import { DialogConfig } from './dialog-config';
import { DialogsContainerComponent } from './dialogs-container/dialogs-container.component';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  private overlayRef: OverlayRef;
  private wrapperRef: ComponentRef<DialogsContainerComponent>;

  constructor(
    private readonly overlay: Overlay,
  ) {
  }

  open<C>(config: DialogConfig<C>): DialogRef<C> {
    if (!this.overlayRef) {
      const overlayConfig = this.getOverlayConfig();
      this.overlayRef = this.overlay.create(overlayConfig);
      this.wrapperRef = this.overlayRef.attach<DialogsContainerComponent>(new ComponentPortal(DialogsContainerComponent));
    }
    return this.wrapperRef.instance.openDialog(config);
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: false,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }
}
