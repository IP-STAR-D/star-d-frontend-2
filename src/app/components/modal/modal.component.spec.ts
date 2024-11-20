import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentModal } from './modal.component';

describe('AppointmentModal', () => {
  let component: AppointmentModal;
  let fixture: ComponentFixture<AppointmentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
