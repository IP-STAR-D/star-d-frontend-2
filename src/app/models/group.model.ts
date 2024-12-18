export class Group {
  groupId: number;
  degreeId: number;
  bossId: number;
  an: number;
  groupName: string;

  constructor(groupId: number, degreeId: number, bossId: number, an: number, groupName: string) {
    this.groupId = groupId;
    this.degreeId = degreeId;
    this.bossId = bossId;
    this.an = an;
    this.groupName = groupName;
  }
}
