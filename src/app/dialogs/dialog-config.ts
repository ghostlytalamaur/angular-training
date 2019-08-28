import { Injector, Type } from '@angular/core';

export interface DialogConfig<C> {
  // A title of a dialog
  title: string;
  // A component that will be displayed in a dialog
  component: Type<C>;
  // A custom injector to create component
  injector?: Injector;
  // Doesn't allow maximize dialog. Default is false
  blockMaximize?: boolean;
}
