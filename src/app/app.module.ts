import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ApiService } from './api.service';

import { AppComponent } from './app.component';
import { BuildDanceComponent } from './build-dance/build-dance.component';


@NgModule({
  declarations: [
    AppComponent,
    BuildDanceComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
