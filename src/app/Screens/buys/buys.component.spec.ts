import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuysComponent } from './buys.component';

describe('BuysComponent', () => {
  let component: BuysComponent;
  let fixture: ComponentFixture<BuysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuysComponent]
    });
    fixture = TestBed.createComponent(BuysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
