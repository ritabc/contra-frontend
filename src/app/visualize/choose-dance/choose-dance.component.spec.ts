import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDanceComponent } from './choose-dance.component';

describe('ChooseDanceComponent', () => {
  let component: ChooseDanceComponent;
  let fixture: ComponentFixture<ChooseDanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseDanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseDanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
