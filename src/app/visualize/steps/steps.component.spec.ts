import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsComponent } from './steps.component';
import { TitleCasePipe } from '../../titleCase.pipe';
import { ApiService } from '../../api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StepsComponent', () => {
  let component: StepsComponent;
  let fixture: ComponentFixture<StepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        StepsComponent,
        TitleCasePipe
      ],
      providers: [ApiService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
