import { Professor } from './professor.model';
import { Student } from './student.model';
import { Group } from './group.model';
import { Degree } from './degree.model';
import { Faculty } from './faculty.model';

export class User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;

  constructor(userId: number, email: string, firstName: string, lastName: string, isAdmin: boolean) {
    this.userId = userId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isAdmin = isAdmin;
  }
}

export class UserResponse {
  user: User;
  student?: Student;
  group?: Group;
  degree?: Degree;
  faculty?: Faculty;
  professor?: Professor;

  constructor(user: User, student?: Student, group?: Group, degree?: Degree, faculty?: Faculty, professor?: Professor) {
    this.user = user;
    this.student = student;
    this.group = group;
    this.degree = degree;
    this.faculty = faculty;
    this.professor = professor;
  }
}
