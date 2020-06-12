import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SovComponent } from './sov.component';

describe('SovComponent', () => {
  let component: SovComponent;
  let fixture: ComponentFixture<SovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
