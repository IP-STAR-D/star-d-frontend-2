import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent {
  id: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
