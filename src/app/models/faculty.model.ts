export class Faculty {
  facultyId: number;
  facultyName: string;
  shortName: string;

  constructor(facultyId: number, facultyName: string, shortName: string) {
    this.facultyId = facultyId;
    this.facultyName = facultyName;
    this.shortName = shortName;
  }
}
