export class Degree {
  degreeId: number;
  degreeName: string;
  facultyId: number;
  shortName: string;

  constructor(degreeId: number, degreeName: string, facultyId: number, shortName: string) {
    this.degreeId = degreeId;
    this.degreeName = degreeName;
    this.facultyId = facultyId;
    this.shortName = shortName;
  }
}
