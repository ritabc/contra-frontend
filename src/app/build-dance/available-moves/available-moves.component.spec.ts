import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TitleCasePipe } from './../../titleCase.pipe';
import { AvailableMovesComponent } from './available-moves.component';

describe('AvailableMovesComponent', () => {
  let component: AvailableMovesComponent;
  let fixture: ComponentFixture<AvailableMovesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AvailableMovesComponent, TitleCasePipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableMovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
