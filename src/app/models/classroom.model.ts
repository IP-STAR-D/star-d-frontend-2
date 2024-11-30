export class Classroom {
  classroomId: number;
  classroomName: string;
  capacity: number;

  constructor(classroomId: number, classroomName: string, capacity: number) {
    this.classroomId = classroomId;
    this.classroomName = classroomName;
    this.capacity = capacity;
  }
}
