import { User } from '../models/user.model';

export const usersData: User[] = [
  new User(1, 'turcu.cristina@usm.com', 'Cristina', 'Turcu', 'password123', false),
  new User(2, 'turcu.corneliu@usm.com', 'Corneliu', 'Turcu', 'password123', false),
  new User(3, 'petrariu.adrian@usm.com', 'Adrian', 'Petrariu', 'password123', false),
  new User(4, 'danubianu.mirela@usm.com', 'Mirela', 'Danubianu', 'password123', false),
  new User(5, 'gherman.ovidiu@usm.com', 'Ovidiu', 'Gherman', 'password123', false),
  new User(6, 'admin@university.com', 'Admin', 'User', 'admin123', true),
  new User(7, 'dorin.birsan@student.usv.ro', 'Dorin', 'Birsan', 'password123', false),
  new User(8, 'alex.olear@student.usv.ro', 'Alex', 'Olear', 'password456', false),
  new User(9, 'raul.luculescu@student.usv.ro', 'Raul', 'Luculescu', 'password789', false),
  new User(10, 'claudiu.baroiu@student.usv.ro', 'Claudiu', 'Baroiu', 'password000', false),
];
