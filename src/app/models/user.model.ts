export class User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isAdmin: boolean;

  constructor(userId: number, email: string, firstName: string, lastName: string, password: string, isAdmin: boolean) {
    this.userId = userId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}
