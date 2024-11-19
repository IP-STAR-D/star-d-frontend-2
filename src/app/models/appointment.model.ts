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
    status: string = 'pending',
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
