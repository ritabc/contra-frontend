import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ApiService } from './api.service';
import { TitleCasePipe } from './titleCase.pipe';

import { AppComponent } from './app.component';
import { BuildDanceComponent } from './build-dance/build-dance.component';
import { DraftComponent } from './build-dance/draft/draft.component';
import { AvailableMovesComponent } from './build-dance/available-moves/available-moves.component';
import { PositionsComponent } from './build-dance/positions/positions.component';
import { VisualizeComponent } from './visualize/visualize.component';


@NgModule({
  declarations: [
    AppComponent,
    BuildDanceComponent,
    TitleCasePipe,
    DraftComponent,
    AvailableMovesComponent,
    PositionsComponent,
    VisualizeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'build-a-dance',
        component: BuildDanceComponent
      },
      {
        path: 'visualize',
        component: VisualizeComponent
      }
    ]),
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
