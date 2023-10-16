import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularTvComponent } from './popular-tv.component';

describe('PopularTvComponent', () => {
  let component: PopularTvComponent;
  let fixture: ComponentFixture<PopularTvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopularTvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
