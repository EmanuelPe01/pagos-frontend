import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadSkeletonComponent } from './load-skeleton.component';

describe('LoadSkeletonComponent', () => {
  let component: LoadSkeletonComponent;
  let fixture: ComponentFixture<LoadSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadSkeletonComponent]
    });
    fixture = TestBed.createComponent(LoadSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
