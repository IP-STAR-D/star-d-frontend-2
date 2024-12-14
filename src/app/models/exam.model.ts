export class Exam {
  examId: number;
  professorId: number;
  class_name: string;
  degreeId: number;
  semester: number;
  user: { email: string; firstName: string; lastName: string };
  year: number;
  type: 'exam' | 'colloquy';

  constructor(
    examId: number,
    professorId: number,
    class_name: string,
    degreeId: number,
    semester: number,
    user: { email: string; firstName: string; lastName: string },
    year: number,
    type: 'exam' | 'colloquy'
  ) {
    this.examId = examId;
    this.professorId = professorId;
    this.class_name = class_name;
    this.degreeId = degreeId;
    this.semester = semester;
    this.year = year;
    this.user = user;
    this.type = type;
  }
}
