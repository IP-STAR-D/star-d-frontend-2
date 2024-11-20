import { Appointment } from '../models/appointment.model';

export const appointmentsData: Appointment[] = [
  new Appointment(1, 1, 3142, 'accepted', new Date('2024-01-15T10:00:00'), new Date('2024-01-15T12:00:00'), 201),
  new Appointment(2, 2, 3142, 'pending', new Date('2024-02-10T14:00:00'), new Date('2024-02-10T16:00:00'), 202),
  new Appointment(3, 3, 3142, 'rejected', new Date('2024-03-05T09:00:00'), new Date('2024-03-05T11:00:00'), 103),
];
