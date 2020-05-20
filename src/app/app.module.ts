import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilePickerModule } from './file-picker/file-picker.module';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AppRoutingModule } from './app-routing.module';
import { FlexBoxesComponent } from './flex-boxes/flex-boxes.component';
import { DialogsSampleModule } from './dialogs-sample/dialogs-sample.module';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipeModule } from './async-pipe/async-pipe.module';


@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    FlexBoxesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FilePickerModule,

    DialogsSampleModule,
    AsyncPipeModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
