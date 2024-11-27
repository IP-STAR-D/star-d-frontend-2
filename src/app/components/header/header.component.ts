import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink,Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  LogoutButton: boolean = true;

  constructor(private router:Router,private authService:AuthService){}

  ngOnInit():void{
    this.router.events.subscribe(() => {
      this.LogoutButton = this.router.url !== '/login';
    });

  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
