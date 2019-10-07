import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AvailableMovesComponent } from './available-moves/available-moves.component';
import { PositionsComponent } from './positions/positions.component';
import { DraftComponent } from './draft/draft.component';
import { TitleCasePipe } from './../titleCase.pipe';
import { ApiService } from './../api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BuildDanceComponent } from './build-dance.component';

describe('BuildDanceComponent', () => {
  let component: BuildDanceComponent;
  let fixture: ComponentFixture<BuildDanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        BuildDanceComponent,
        AvailableMovesComponent,
        PositionsComponent,
        DraftComponent,
        TitleCasePipe
      ],
      providers: [ApiService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildDanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
