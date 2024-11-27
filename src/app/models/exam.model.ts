export class Exam {
  examId: number;
  professorId: number;
  class_name: string;
  degreeId: number;
  semester: number;

  constructor(examId: number, professorId: number, class_name: string, degreeId: number, semester: number) {
    this.examId = examId;
    this.professorId = professorId;
    this.class_name = class_name;
    this.degreeId = degreeId;
    this.semester = semester;
  }
}
