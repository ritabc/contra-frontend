import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TitleCasePipe } from './../../titleCase.pipe';

import { PositionsComponent } from './positions.component';
import { ApiService } from '../../api.service';

describe('PositionsComponent', () => {
  let component: PositionsComponent;
  let fixture: ComponentFixture<PositionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PositionsComponent, TitleCasePipe],
      providers: [ApiService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
