import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.getIsLoggedIn()) {
      // Đã đăng nhập, cho phép truy cập vào trang
      return true;
    } else {
      // Chưa đăng nhập, điều hướng về trang đăng nhập

      return false;
    }
  }
}
