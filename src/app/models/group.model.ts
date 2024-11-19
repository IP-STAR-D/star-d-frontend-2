export class Group {
  groupId: number;
  degreeId: number;
  bossId: number;
  an: number;

  constructor(groupId: number, degreeId: number, bossId: number, an: number) {
    this.groupId = groupId;
    this.degreeId = degreeId;
    this.bossId = bossId;
    this.an = an;
  }
}
