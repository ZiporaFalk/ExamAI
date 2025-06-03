import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeAppealComponent } from './grade-appeal.component';

describe('GradeAppealComponent', () => {
  let component: GradeAppealComponent;
  let fixture: ComponentFixture<GradeAppealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeAppealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeAppealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
