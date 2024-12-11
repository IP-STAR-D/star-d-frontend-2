import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.authService.loadAuthState().then(() => {
      if (this.authService.isAuthenticated()) {
        const role = this.authService.getRole();
        if(route.data['requiredRole'] === role) {
          return true;
        } else {
          return false;
        }
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
