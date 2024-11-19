export class Degree {
  degreeId: number;
  degreeName: string;
  facultyId: number;

  constructor(degreeId: number, degreeName: string, facultyId: number) {
    this.degreeId = degreeId;
    this.degreeName = degreeName;
    this.facultyId = facultyId;
  }
}
