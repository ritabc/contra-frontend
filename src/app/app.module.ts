import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ApiService } from './api.service';
import { TitleCasePipe } from './titleCase.pipe';

import { AppComponent } from './app.component';
import { BuildDanceComponent } from './build-dance/build-dance.component';


@NgModule({
  declarations: [
    AppComponent,
    BuildDanceComponent,
    TitleCasePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'next-moves',
        component: BuildDanceComponent
      },
      {
        path: 'positions',
        component: BuildDanceComponent
      }
    ]),
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
