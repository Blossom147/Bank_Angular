import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  AbstractControl,
  FormBuilder
} from '@angular/forms';
import { API_GET_USER, API_UPDATE_USER, API_UPDATE_USER_DETAILS } from 'src/app/common/constants';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  validateForm!: FormGroup;
  username = localStorage.getItem('username');

  constructor(private fb: FormBuilder,private http: HttpClient,) {
  }


  ngOnInit() {
    this.validateForm = this.fb.group(
      {
        username: [this.username, Validators.required],
        phone: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
        firstName: [null],
        lastName: [null],
        address:[null],
        company:[null],
        email: [null, [Validators.required, Validators.email]],
        // password: [null, Validators.required],
        // confirm: [null, Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

    // Lấy thông tin người dùng và điền vào các trường
    console.log(this.username);

    this.getUserDetails();
  }

  // Kiểm trả mật khẩu có trùng khớp
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirm')?.value;

    if (password === confirm) {
      control.get('confirm')?.setErrors(null);
    } else {
      control.get('confirm')?.setErrors({ mismatch: true });
    }
  }


  getUserDetails() {
    const username = this.username;
    const url = API_GET_USER+`${username}`;
    console.log(url);

    this.http.get<any>(url)
      .subscribe(response => {
        if (response) {
          console.log(response.data);

          // Hiển thị form chỉnh sửa thông tin người dùng
          this.validateForm.patchValue({
            phone: response.data.phone,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            address: response.data.address,
            company: response.data.company,
          });
        } else {
          console.error('Failed to fetch user details.');
        }
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  submitForm(){
    this.updateUser();
  }


// hàm cập nhật tài khoản
updateUser() {
  // Kiểm tra hợp lệ của form trước khi cập nhật thông tin người dùng

  // Lấy dữ liệu từ form
  const username = this.validateForm.get('username')?.value;
  const email = this.validateForm.get('email')?.value;
  const firstName = this.validateForm.get('firstName')?.value;
  const lastName = this.validateForm.get('lastName')?.value;
  const phone = this.validateForm.get('phone')?.value;
  const company = this.validateForm.get('company')?.value;
  const address = this.validateForm.get('address')?.value;


  const formData = {
    username: username ?? null,
    email: email ?? null,
    firstName: firstName ?? null,
    phone: phone ?? null,
    lastName: lastName ?? null,
    company: company ?? null,
    address: address ?? null,
  };

  console.log(formData);
  // Gọi API backend để cập nhật thông tin người dùng
  this.http.put(API_UPDATE_USER_DETAILS,formData)
    .subscribe((response: any) => {
      // Xử lý kết quả trả về từ API
      if (response.status === '200') {
        // Cập nhật thành công, thực hiện các hành động cần thiết
        console.log('Updated successfully:', response.data);
      } else {
        // Cập nhật thất bại, hiển thị thông báo lỗi
        console.error('Update failed:', response.message);
      }
    }, (error: any) => {
      // Xử lý lỗi nếu có
      console.error('An error occurred:', error);
    });
}
}
