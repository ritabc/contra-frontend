import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DanceDraftComponent } from './dance-draft.component';

describe('DanceDraftComponent', () => {
  let component: DanceDraftComponent;
  let fixture: ComponentFixture<DanceDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DanceDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DanceDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
