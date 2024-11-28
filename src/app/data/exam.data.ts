import { Exam } from '../models/exam.model';

export const examsData: Exam[] = [
  new Exam(1, 1, 'Ingineria programelor', 1, 2, { firstName: 'Ion', lastName: 'Popescu' }, 1),
  new Exam(2, 2, 'Sisteme inteligente', 1, 2, { firstName: 'Vasile', lastName: 'Ionescu' }, 3),
  new Exam(3, 3, 'SIIEP', 1, 2, { firstName: 'Mihai', lastName: 'Georgescu' }, 4),
  new Exam(4, 4, 'Proiectarea bazelor de date', 1, 2, { firstName: 'Andrei', lastName: 'Popa' }, 1),
  new Exam(5, 5, 'Proiectarea translatoarelor', 1, 2, { firstName: 'Marian', lastName: 'Pop' }, 2),
  new Exam(6, 5, 'Calcul mobil', 1, 2, { firstName: 'Marian', lastName: 'Pop' }, 1),
];
