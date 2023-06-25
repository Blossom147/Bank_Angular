import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service';
import { API_GET_ROLE, API_LOGIN } from '../../common/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent   implements OnInit {

  isLoggedIn = false; // Mặc định chưa đăng nhập
  passwordVisible = false;
  password?: string;
  loginForm!: FormGroup;
  loginError =  false;
  roles : string = '';



  constructor(private formBuilder: FormBuilder,
              private appComponent: AppComponent,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private cdr: ChangeDetectorRef) { }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa(username + ':' + password));
    return this.http.post<any>(API_LOGIN, null, { headers });
  }

  ngOnInit(): void {
    this.appComponent.showHeaderSidebar = false;


    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  onSubmit() {
    const { username, password } = this.loginForm.value;

    this.login(username, password).subscribe(
      response => {
        // Xử lý thành công
        this.authService.login(); // Cập nhật trạng thái đăng nhập thành công
        localStorage.setItem('username', username);
        console.log('Đăng nhập thành công với tài khoản:', response);

        // Gọi API để lấy vai trò (role)
        this.http.get<any>(API_GET_ROLE + `${username}`).subscribe(
          roleResponse => {
            console.log('Vai trò:', roleResponse);
            this.roles = roleResponse.roles;
            localStorage.setItem('roles', this.roles); // Lưu vai trò vào localStorage
            this.appComponent.checkUserRole(); // Gọi phương thức checkUserRole()
            this.router.navigateByUrl('/home'); // Chuyển hướng tới trang home
            this.appComponent.showHeaderSidebar = true;
          },
          roleError => {
            console.error('Lỗi lấy vai trò:', roleError);
          }
        );
      },
      error => {
        // Xử lý lỗi
        console.error('Lỗi đăng nhập:', error);
        this.loginError = true;
        // Hiển thị thông báo lỗi cho người dùng
      }
    );
  }


}
