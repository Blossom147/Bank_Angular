
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  constructor(private formBuilder: FormBuilder,
    ) { }

  login() {
    // Logic xử lý đăng nhập

    this.isLoggedIn = true;
  }

  logout() {
    // Logic xử lý đăng xuất
    this.isLoggedIn = false;
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }
}
