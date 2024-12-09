export class Appointment {
  appointmentId: number;
  examId: number;
  groupId: number;
  status: string;
  startTime: Date;
  endTime: Date;
  classroomId: number;

  constructor(
    appointmentId: number,
    examId: number,
    groupId: number,
    status: string,
    startTime: Date,
    endTime: Date,
    classroomId: number
  ) {
    this.appointmentId = appointmentId;
    this.examId = examId;
    this.groupId = groupId;
    this.status = status;
    this.startTime = startTime;
    this.endTime = endTime;
    this.classroomId = classroomId;
  }
}

export class Matches {
  id: number;
  matches: string[];

  constructor(id: number, matches: string[]) {
    this.id = id;
    this.matches = matches;
  }
}

export class FilteredAppointmentsResponse {
  appointments: Appointment[];
  matches: Matches[];

  constructor(appointments: Appointment[], matches: Matches[]) {
    this.appointments = appointments;
    this.matches = matches;
  }
}
