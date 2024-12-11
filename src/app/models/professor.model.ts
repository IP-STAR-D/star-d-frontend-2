import { User } from "./user.model";

export class Professor {
  userId: number;
  facultyId: number;
  user?: User | null; // Proprietatea este opțională sau poate fi null

  constructor(userId: number, facultyId: number, user?: User | null) {
    this.userId = userId;
    this.facultyId = facultyId;
    this.user = user ?? null;
  }
}
