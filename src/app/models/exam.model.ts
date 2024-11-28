export class Exam {
  examId: number;
  professorId: number;
  class_name: string;
  degreeId: number;
  semester: number;
  user: { firstName: string; lastName: string };
  year: number;

  constructor(
    examId: number,
    professorId: number,
    class_name: string,
    degreeId: number,
    semester: number,
    user: { firstName: string; lastName: string },
    year: number
  ) {
    this.examId = examId;
    this.professorId = professorId;
    this.class_name = class_name;
    this.degreeId = degreeId;
    this.semester = semester;
    this.year = year;
    this.user = user;
  }
}
