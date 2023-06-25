import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API_DELETE_QR, API_DELETE_QR_USER, API_GET_ALL_QR, API_GET_ALL_QR_USER, API_GET_QR_BY_ID, API_SEARCH_QR_USER, API_UPDATE_QR_USER } from 'src/app/common/constants';

@Component({
  selector: 'app-my-qr',
  templateUrl: './my-qr.component.html',
  styleUrls: ['./my-qr.component.css']
})
export class MyQRComponent implements OnInit{
  @ViewChild('table', { static: false }) table: ElementRef | undefined;

  username = localStorage.getItem('username');
  QRList: any[] = [];

  totalQR: number = 0;
  currentPage: number = 1;
  pageSize: number = 6;
  qrCount: number = 0;


  loading: boolean = false; //
  // Phần tìm kiếm
  searchType: string= '';
  searchFromDay :  string= '';
  searchToDay :  string= '';
  searchStatus: string= '';
  public defaultFromDate: string= '';
  public defaultToDate: string= '';
  notification: any; // Thông tin thông báo

  selecteQR: any = null;
  showEditForm = false;
  editForm: FormGroup;
  fb: FormBuilder;
  editMode = false;
  form: FormGroup;


  constructor(
    private http: HttpClient,
    private modal: NzModalService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    ) {
      this.table = undefined;
      this.fb = formBuilder;
      this.form = this.formBuilder.group({});
  // Khởi tạo form
    this.editForm = this.formBuilder.group({
    qrName: [null],
    qrType: [null],
    id:[null]
    // Thêm các trường khác tương tự
  });
    }



  ngOnInit(): void {
    this.notification = {
      success: (title: string, message: string) => {
        // Thực hiện hành động khi thành công
        console.log('Success:', title, message);
      }
    };
    this.getQR(this.username);
    this.setDateTime();
  }

  // Đặt giá trị cho các trường tìm kiếm
  setDateTime(): void{
    const fromDate = new Date('2022-01-01');
    this.defaultFromDate = fromDate.toISOString().split('T')[0];

    const toDate = new Date();
    this.defaultToDate = toDate.toISOString().split('T')[0];

    this.searchFromDay = this.defaultFromDate;
    this.searchToDay = this.defaultToDate;

    this.searchType = 'All';
    this.searchStatus = 'All';
  }

  loadListQR(qr: any[]): void {
    this.QRList = Array.isArray(qr) ? qr : [];
    this.totalQR = this.QRList.length;

    this.QRList.forEach(qrItem => {
       if (qrItem.trnDt.length === 8) {
        // Xử lý khi `trnDt` có độ dài 8 ký tự (vd: "20230525")
        const year = qrItem.trnDt.slice(0, 4);
        const month = qrItem.trnDt.slice(4, 6);
        const day = qrItem.trnDt.slice(6, 8);
        qrItem.trnDt = `${day}-${month}-${year}`;
      } else {
        // Xử lý khi `trnDt` không rõ định dạng
        // Thực hiện chuyển đổi theo logic của bạn
        // ...
      }
    });

    this.loading = false;
  }
  // Lấy ra thông tin tất cả mã QR
  getQR(user:any): void {
    this.loading = true;
    const username = localStorage.getItem('username');
    const url = API_GET_ALL_QR_USER+`${username}`;

    this.http.get<any>(url)
      .subscribe(response => {
      console.log(response);
      console.log(response.status);
      if (response) {
        this.qrCount = response.length;
       this.loadListQR(response);
      } else {
        console.error('Failed to fetch QR list.');
        this.loading = false;
      }
    });
}


  public searchQR(){
    const url = API_SEARCH_QR_USER;

    // Xây dựng query parameters
    let params: { qrType: string, username: string} = {
      qrType: this.searchType === 'All' ? '' : this.searchType,
      username: this.username!,
    };
    console.log(params);
    // Gửi yêu cầu GET với query parameters
    this.http.get<any>(url,{ params }).subscribe(
      response => {
        console.log(response);
        // Xử lý dữ liệu trả về từ backend
        this.loadListQR(response);
      },
      error => {
        console.error('Failed to fetch transaction list.', error);
      }
    );
  }

  public reLoad(){
    this.getQR(this.username);
  }

  public editQR(qr : any){
    this.selecteQR = qr; // Gán người dùng được chọn vào thuộc tính selecteQR
    this.showEditForm = true;

     // Gọi API backend để lấy thông tin người dùng cần chỉnh sửa
     const id = qr.id;

     const url =  API_GET_QR_BY_ID+`${id}`;
     console.log("url: ",url);

     this.http.get<any>(url).subscribe(
      (response) => {
        if (response) {
          this.selecteQR = response;
          console.log(response);

          // Hiển thị form chỉnh sửa thông tin người dùng
        this.editForm.patchValue({
          qrName: response.qrName,
          qrType: response.qrType,
          id: response.id,
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

  public showDeleteConfirm(qr: any): void {
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa',
      nzContent: `Bạn có muốn xóa mã QR này không?`,
      nzOkText: 'Xóa',
      nzOkType: 'default',
      nzOnOk: () => this.deleteQR(qr),
      nzCancelText: 'Hủy',
      nzOnCancel: () => {},
    });
  }

  public showDeleteSuccess(qr: any): void {
    this.modal.confirm({
      nzTitle: 'Thông báo',
      nzContent: `Bạn đã xóa thành công!?`,
      nzOkType: 'default',
      nzOnCancel: () => {},
    });
  }

  // Hàm gọi API xử lí xóa
  deleteQR(qr: any): void {
    // Lấy id từ đối tượng qr
    const id = qr.id;
    const url =  API_DELETE_QR+`${id}`;

    // Gọi API xóa QR
    this.http.delete(url).subscribe(
      () => {
        // Xóa qr khỏi danh sách
        this.QRList = this.QRList.filter(u => u.id !== id);
        // Cập nhật tổng số mã QR
        this.totalQR -= 1;
        this.reLoad();
        // Hiển thị thông báo thành công
        this.showDeleteSuccess(qr);
        this.notification.success('Xóa mã QR', 'Mã QR đã được xóa thành công!');

      },
      (error) => {
        // Xử lý lỗi khi xóa
        this.notification.error('Lỗi', 'Đã xảy ra lỗi khi xóa !');
      }
    );
  }

  // Tính toán hiển thị số thứ tự
  getDisplayedQRList(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    return this.QRList.slice(startIndex, endIndex).map((qr, index) => ({
      ...qr,
      serialNumber: startIndex + index + 1,
    }));
  }

  onPageChange(pageIndex: number): void {
    this.currentPage = pageIndex;
    // Cuộn đến đầu bảng
    if (this.table) {
      this.table.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  updateQR(){
  // Kiểm tra hợp lệ của form trước khi cập nhật thông tin người dùng
  if (this.editForm.invalid) {
    // Nếu form không hợp lệ, hiển thị thông báo lỗi và dừng việc cập nhật
    this.notification.error('Lỗi', 'Vui lòng kiểm tra thông tin nhập vào.');
    return;
  }

  const qrName = this.editForm.get('qrName')?.value;
  const qrType = this.editForm.get('qrType')?.value;
  const id = this.editForm.get('id')?.value;
  const formData = {
    qrName: qrName ?? null,
    qrType: qrType ?? null,
    id: id?? null,
  };

  console.log(formData);
  // Gọi API backend để cập nhật thông tin người dùng
  this.http.put(API_UPDATE_QR_USER,formData)
    .subscribe((response: any) => {
      console.log("form",formData);

      // Xử lý kết quả trả về từ API
      if (response.status === '200') {
        // Cập nhật thành công, thực hiện các hành động cần thiết
        console.log('Updated successfully:', response.data);
        this.getQR(this.username);
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

  // Hàm hủy việc xóa
  cancelEdit() {
    this.showEditForm = false;
    this.editForm.reset(); // Reset giá trị của form
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
