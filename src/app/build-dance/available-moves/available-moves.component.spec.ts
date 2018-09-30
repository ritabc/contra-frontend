import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableMovesComponent } from './available-moves.component';

describe('AvailableMovesComponent', () => {
  let component: AvailableMovesComponent;
  let fixture: ComponentFixture<AvailableMovesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableMovesComponent ]
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
