export class Semester {
  semesterId: number;
  year: string;
  semester: number;
  colloquyStart: Date;
  colloquyEnd: Date;
  examStart: Date;
  examEnd: Date;
  semesterStart: Date;
  semesterEnd: Date;

  constructor(
    semesterId: number,
    year: string,
    semester: number,
    colloquyStart: Date,
    colloquyEnd: Date,
    examStart: Date,
    examEnd: Date,
    semesterStart: Date,
    semesterEnd: Date
  ) {
    this.semesterId = semesterId;
    this.year = year;
    this.semester = semester;
    this.colloquyStart = new Date(colloquyStart);
    this.colloquyEnd = new Date(colloquyEnd);
    this.examStart = new Date(examStart);
    this.examEnd = new Date(examEnd);
    this.semesterStart = new Date(semesterStart);
    this.semesterEnd = new Date(semesterEnd);
  }
}
