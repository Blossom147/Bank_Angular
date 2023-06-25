import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  showHeaderSidebar = true;
  userName: string = 'Long';
  isAdmin = false;
  constructor(private router: Router,
    private authService: AuthService,) {}

    ngOnInit() {
      this.checkUserRole();
    }

    checkUserRole() {
      const role = localStorage.getItem('roles');
      if (role === 'ADMIN') {
        // Xử lý cho vai trò ADMIN
        console.log('Người dùng có vai trò ADMIN');
        this.isAdmin = true; // Gán giá trị true cho biến isAdmin
      } else {
        // Xử lý cho các vai trò khác
        console.log('Người dùng không có vai trò ADMIN');
        this.isAdmin = false; // Gán giá trị false cho biến isAdmin
      }
    }



  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login'); // Call the logout method from the AuthService or your authentication service
    // Perform any other actions required during logout
  }
}
