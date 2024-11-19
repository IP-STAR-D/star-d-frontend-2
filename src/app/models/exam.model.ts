export class Exam {
  examId: number;
  professorId: number;
  className: string;
  degreeId: number;
  semester: number;

  constructor(examId: number, professorId: number, className: string, degreeId: number, semester: number) {
    this.examId = examId;
    this.professorId = professorId;
    this.className = className;
    this.degreeId = degreeId;
    this.semester = semester;
  }
}
