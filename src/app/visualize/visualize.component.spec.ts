import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeComponent } from './visualize.component';
import { StepsComponent } from './steps/steps.component';
import { ChooseDanceComponent } from './choose-dance/choose-dance.component';
import { AnimationComponent } from './animation/animation.component';
import { TitleCasePipe } from '../titleCase.pipe';
import { ApiService } from '../api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SnakeToCamelPipe } from '../snakeToCamel.pipe';

describe('VisualizeComponent', () => {
  let component: VisualizeComponent;
  let fixture: ComponentFixture<VisualizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        VisualizeComponent,
        StepsComponent,
        ChooseDanceComponent,
        AnimationComponent,
        TitleCasePipe,
      ],
      providers: [ApiService, SnakeToCamelPipe],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
