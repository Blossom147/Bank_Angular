import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { API_GET_COUNT_TRANSACTION, API_GET_TRANSACTIONS, API_SEARCH_TRANSACTION, API_SEARCH_TRANSACTION_ACTIVITY } from '../../common/constants';

@Component({
  selector: 'app-transaction-manager',
  templateUrl: './transaction-manager.component.html',
  styleUrls: ['./transaction-manager.component.css']
})


export class TransactionManagerComponent implements OnInit {
  transList: any[] = [];

  totalTrans: number = 0;
  currentPage: number = 1;
  pageSize: number = 6;
  countTrans: number = 0;

  loading: boolean = false;

  // Biến cho phần chỉnh sửa
  notification: any;
  selectedTrans: any = null;
  showEditForm = false;
  expandTemplate: any;
  msgContent: string = ''; // Biến để lưu trữ nội dung chuỗi JSON
  formattedMsgContent: string = '';

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
    ) {
    }


  ngOnInit(): void {
    this.getCountTrans();
    this.setDateTime();
    this.getTrans();
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


  // Tải danh sách giao dịch
  loadListTransaction(transactions: any[]): void {
    this.transList = Array.isArray(transactions) ? transactions : [];
    this.totalTrans = this.transList.length;
    this.loading = false;
  }

  // Lấy ra danh sách giao dịch
  getTrans(): void {
    this.loading = true;
    const url = API_GET_TRANSACTIONS;

    this.http.get<any>(url)
      .subscribe(response => {
        console.log(response);
        if (response) {
          this.loadListTransaction(response);
        } else {
          console.error('Failed to fetch transaction list.');
          this.loading = false;
        }
      });
  }


  onPageChange(pageIndex: number): void {
    this.currentPage = pageIndex;
  }

    // Hàm để gọi API lấy ra danh sách chi tiết giao dịch
   // Hàm queryTransaction
   queryTransaction(trans: any): void {
    // Kiểm tra xem dữ liệu bảng con đã được tải trước đó hay chưa
    if (trans.expand) {
      // Nếu bảng con đang mở, đóng bảng con bằng cách đặt trans.expand thành false
      trans.expand = false;
    } else
    if (!trans.children) {

      // Gọi API để lấy dữ liệu bảng con dựa trên transactionId
      fetch(API_SEARCH_TRANSACTION_ACTIVITY + trans.transactionId)
        .then(response => response.json())
        .then(childData => {
          // Gán dữ liệu bảng con vào thuộc tính children của trans
          trans.children = childData;

          // Đánh dấu trans.expand là true để hiển thị bảng con
          trans.expand = true;

          // Log dữ liệu nhận được từ backend
          console.log('Dữ liệu bảng con:', childData);
        })
        .catch(error => {
          console.error('Lỗi khi tải dữ liệu bảng con:', error);
        });
    } else {
      // Nếu dữ liệu bảng con đã được tải trước đó, chỉ cần đánh dấu trans.expand là true để hiển thị bảng con
      trans.expand = true;
    }
  }


  // Hiển thị chuỗi Json mỗi giao dịch
  showMsgContent(child: any): void {
    this.msgContent = child.msgContent;
    this.formattedMsgContent = JSON.stringify(JSON.parse(this.msgContent), null, 2);
    this.showMsg = true;
  }
    closeForm(): void {
    this.showMsg = false;
  }

  // Tìm kiếm giao dịch
  searchTransactions() {
    const url = API_SEARCH_TRANSACTION;

    // Xây dựng query parameters
    let params: { type: string; status: string; startDate : string; endDate: string } = {
      type: this.searchType === 'All' ? '' : this.searchType,
      status: this.searchStatus === 'All' ? '' : this.searchStatus,
      startDate: this.searchFromDay ? this.searchFromDay.toString().split('T')[0]+"T00:00:00.000" : '',
      endDate: this.searchToDay ? this.searchToDay.toString().split('T')[0]+"T00:00:00.000" : '',
    };
    console.log(params);
    // Gửi yêu cầu GET với query parameters
    this.http.get<any>(url, { params }).subscribe(
      response => {
        console.log(response);
        // Xử lý dữ liệu trả về từ backend
        this.loadListTransaction(response);
      },
      error => {
        console.error('Failed to fetch transaction list.', error);
      }
    );
  }

  // Tính toán hiển thị số thứ tự
  getDisplayedTransList(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    return this.transList.slice(startIndex, endIndex).map((trans, index) => ({
      ...trans,
      serialNumber: startIndex + index + 1,
    }));
  }

  // Tải lại danh sách
  reLoad(){
    this.getTrans();
  }

  // Lấy ra số lượng bản ghi
  getCountTrans(){
    const url = API_GET_COUNT_TRANSACTION;
    this.http.get<any>(url).subscribe(
      response => {
        console.log(response);
        // Xử lý dữ liệu trả về từ backend
        this.countTrans = response;
      },
      error => {
        console.error('Failed to fetch transaction list.', error);
      }
    );

  }
}
