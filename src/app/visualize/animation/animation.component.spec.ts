import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnimationComponent } from './animation.component';
import { SnakeToCamelPipe } from '../../snakeToCamel.pipe';
import { ApiService } from '../../api.service';

describe('AnimationComponent', () => {
  let component: AnimationComponent;
  let fixture: ComponentFixture<AnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AnimationComponent],
      providers: [SnakeToCamelPipe, ApiService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
