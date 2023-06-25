import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API_DELETE_USER, API_GET_ALL_USER, API_GET_USER, API_UPDATE_USER } from 'src/app/common/constants';
@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {
  userList: any[] = [];
  totalUsers: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  loading: boolean = false;
  notification: any;
  selectedUser: any = null;
  showEditForm = false;
  editForm: FormGroup;
  fb: FormBuilder;
  editMode = false;
  form: FormGroup;


  constructor(
    private http: HttpClient,
    private modal: NzModalService,
    private formBuilder: FormBuilder) {
    this.fb = formBuilder;
    this.form = this.formBuilder.group({});
  // Khởi tạo form
    this.editForm = this.formBuilder.group({
    username: [null, Validators.required],
    email: [null ,[Validators.required, Validators.email]],
    phone: [null],
    roles: [null],
    enabled: [null],
    // password: [null],
    // Thêm các trường khác tương tự
  });
   }

  ngOnInit(): void {
    this.getUsers();
  }


  // Lấy ra danh sách tài khoản
  getUsers(): void {
    this.loading = true;
    const url = API_GET_ALL_USER;

    this.http.get<any>(url)
      .subscribe(response => {
        if (response && response.status === '200') {
          this.userList = response.data;
          this.totalUsers = this.userList.length;
          this.loading = false;
        } else {
          console.error('Failed to fetch user list.');
          this.loading = false;
        }
      });
  }

  onPageChange(pageIndex: number): void {
    this.currentPage = pageIndex;
  }

  // Hàm sửa người dùng
  editUser(user: any) {
    this.selectedUser = user; // Gán người dùng được chọn vào thuộc tính selectedUser
    this.showEditForm = true; // Hiển thị form chỉnh sửa
    // Gọi API backend để lấy thông tin người dùng cần chỉnh sửa
    const username = user.username;
    const url =  API_GET_USER+`${username}`;

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.status === '200') {
          this.selectedUser = response.data;
          console.log(response.data);

          // Hiển thị form chỉnh sửa thông tin người dùng
        this.editForm.patchValue({
          username: response.data.username,
          // password : response.data.password,
          enabled: response.data.enabled ? true : false,
          roles : response.data.roles,
          email: response.data.email ,
          phone: response.data.phone,
          // Điền các giá trị khác từ response.data
        });
        } else {
          console.error('Failed to fetch user details.');
        }
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  // Hàm xác nhận xóa
  public showDeleteConfirm(user: any): void {
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa',
      nzContent: `Bạn có muốn xóa tài khoản ${user.username} không?`,
      nzOkText: 'Xóa',
      nzOkType: 'default',
      nzOnOk: () => this.deleteUser(user),
      nzCancelText: 'Hủy',
      nzOnCancel: () => {},
    });
  }

  // Hàm gọi API xử lí xóa
  deleteUser(user: any): void {
  // Lấy tên tài khoản từ đối tượng user
  const username = user.username;
  const url =  API_DELETE_USER+`${username}`;

  // Gọi API xóa người dùng
  this.http.delete(url).subscribe(
    () => {
      // Xóa người dùng khỏi danh sách
      this.userList = this.userList.filter(u => u.username !== username);
      // Cập nhật tổng số người dùng
      this.totalUsers -= 1;
      // Hiển thị thông báo thành công
      this.notification.success('Xóa người dùng', 'Người dùng đã được xóa thành công!');
    },
    (error) => {
      // Xử lý lỗi khi xóa người dùng
      this.notification.error('Lỗi', 'Đã xảy ra lỗi khi xóa người dùng!');
    }
  );
}

// Hàm hủy việc xóa
cancelEdit() {
  this.showEditForm = false;
  this.editForm.reset(); // Reset giá trị của form
}

// hàm cập nhật tài khoản
updateUser() {
  // Kiểm tra hợp lệ của form trước khi cập nhật thông tin người dùng
  if (this.editForm.invalid) {
    // Nếu form không hợp lệ, hiển thị thông báo lỗi và dừng việc cập nhật
    this.notification.error('Lỗi', 'Vui lòng kiểm tra thông tin nhập vào.');
    return;
  }
  const username = this.editForm.get('username')?.value;
  const email = this.editForm.get('email')?.value;
  const roles = this.editForm.get('roles')?.value;
  const phone = this.editForm.get('phone')?.value;
  const enabled = this.editForm.get('enabled')?.value;


  const formData = {
    username: username ?? null,
    email: email ?? null,
    roles: roles ?? null,
    phone: phone ?? null,
    enabled: enabled ?? null,
  };

  console.log(formData);
  // Gọi API backend để cập nhật thông tin người dùng
  this.http.put(API_UPDATE_USER, formData)
    .subscribe((response: any) => {
      // Xử lý kết quả trả về từ API
      if (response.status === '200') {
        // Cập nhật thành công, thực hiện các hành động cần thiết
        console.log('Updated successfully:', response.data);
        this.getUsers();
        this.showEditForm = false;
      } else {
        // Cập nhật thất bại, hiển thị thông báo lỗi
        console.error('Update failed:', response.message);
      }
    }, (error: any) => {
      // Xử lý lỗi nếu có
      console.error('An error occurred:', error);
    });
}



getErrorMessage(field: string): string {
  const control = this.editForm.get(field);
  if (control && control.hasError('required')) {
    return 'Vui lòng nhập email.';
  }
  if (control && control.hasError('email')) {
    return 'Email không hợp lệ.';
  }
  return '';
}



}
