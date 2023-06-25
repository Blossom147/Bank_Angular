import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { API_COUNT_QR, API_DELETE_QR, API_GET_ALL_QR, API_GET_QR_BY_ID, API_SEARCH_QR, API_UPDATE_QR_USER } from 'src/app/common/constants';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-qr-manager',
  templateUrl: './qr-manager.component.html',
  styleUrls: ['./qr-manager.component.css']
})
export class QRManagerComponent implements OnInit{
  @ViewChild('table', { static: false }) table: ElementRef | undefined;

  username = localStorage.getItem('username');
  QRList: any[] = [];

  totalQR: number = 0;
  currentPage: number = 1;
  pageSize: number = 6;
  countQR: number = 0;

  loading: boolean = false; //

  notification: any; // Thông tin thông báo

  // Form chỉnh sửa
  selecteQR: any = null;
  showEditForm = false;
  editForm: FormGroup;
  fb: FormBuilder;
  editMode = false;
  form: FormGroup;


  // Phần tìm kiếm
  searchType: string= '';
  searchFromDay :  string= '';
  searchToDay :  string= '';
  searchStatus: string= '';
  public defaultFromDate: string= '';
  public defaultToDate: string= '';
  showMsg: boolean = false;


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
    this.getQR();
    this.getCountQR();
    this.setDateTime();
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


  // Lấy ra thông tin tất cả mã QR
  getQR(): void {
    this.loading = true;
    const url = API_GET_ALL_QR;

    this.http.get<any>(url)
      .subscribe(response => {
      console.log(response);
      console.log(response.status);
      if (response) {
       this.loadListQR(response);
      } else {
        console.error('Failed to fetch QR list.');
        this.loading = false;
      }
    });
}

  onPageChange(pageIndex: number): void {
    this.currentPage = pageIndex;
    // Cuộn đến đầu bảng
    if (this.table) {
      this.table.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  // Hàm lấy ra số lượng mã QR
  getCountQR(){
    const url = API_COUNT_QR;
    this.http.get<any>(url).subscribe(
      response => {
        console.log(response);
        // Xử lý dữ liệu trả về từ backend
        this.countQR = response;
      },
      error => {
        console.error('Failed to fetch transaction list.', error);
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
        // Hiển thị thông báo thành công
        this.notification.success('Xóa mã QR', 'Mã QR đã được xóa thành công!');
        this.reLoad();
      },
      (error) => {
        // Xử lý lỗi khi xóa
        this.notification.error('Lỗi', 'Đã xảy ra lỗi khi xóa !');
      }
    );
  }


   // Hàm xác nhận xóa
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

   // Tải lại danh sách
   reLoad(){
    this.getQR();
    this.getCountQR();
  }

  // Tìm kiếm mã QR
  searchQR() {
    const url = API_SEARCH_QR;

    // Xây dựng query parameters
    let params: { type: string; status: string; startDate : string; endDate: string } = {
      type: this.searchType === 'All' ? '' : this.searchType,
      status: this.searchStatus === 'All' ? '' : this.searchStatus,
      startDate: this.searchFromDay ? this.searchFromDay.toString().split('T')[0] : '',
      endDate: this.searchToDay ? this.searchToDay.toString().split('T')[0] : ''
    };
    console.log(params);
    // Gửi yêu cầu GET với query parameters
    this.http.get<any>(url, { params }).subscribe(
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

  // Phần chỉnh sửa
  cancelEdit() {
    this.showEditForm = false;
    this.editForm.reset(); // Reset giá trị của form
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
          this.getQR();
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


  // Hiển thị form chỉnh sửa mã QR
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
}
