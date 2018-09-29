import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildDanceComponent } from './build-dance.component';

describe('BuildDanceComponent', () => {
  let component: BuildDanceComponent;
  let fixture: ComponentFixture<BuildDanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildDanceComponent ]
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
