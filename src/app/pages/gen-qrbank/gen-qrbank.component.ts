import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { API_BASE_URL, API_GENQR, API_GET_BANKS } from '../../common/constants';

@Component({
  selector: 'app-gen-qrbank',
  templateUrl: './gen-qrbank.component.html',
  styleUrls: ['./gen-qrbank.component.css']
})
export class GenQRBankComponent implements OnInit {
  qrForm!: FormGroup;
  bankList: { shortName: string, bin: string }[] = [];
  selectedBankName: string | undefined;
  qrCodeData: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.qrForm = this.formBuilder.group({
      serviceCode: ['QRIBFTTA', Validators.required],
      customerName: ['', Validators.required],
      customerId: ['', Validators.required],
      transAmount: ['', Validators.required],
      bankName: ['', Validators.required],
      additionInfo: [''],
      shortName: [''],
      bin: [''],
    });

    this.loadBankList();
  }

  loadBankList(): void {
    this.http.get(API_GET_BANKS).subscribe((response: any) => {
      this.bankList = response.map((bank: any) => ({
        shortName: bank.shortName,
        bin: bank.bin
      }));
    });
  }

  formatAmount(event: any): void {
    const value = event.target.value;
    // Xóa các ký tự không phải là số ra khỏi giá trị đầu vào
    const numericValue = value.replace(/[^0-9]/g, '');
    // Định dạng giá trị số với hàng ngàn dấu phân cách
    const formattedValue = new Intl.NumberFormat('en-US').format(Number(numericValue));
    // Cập nhật giá trị đầu vào với giá trị được định dạng
    event.target.value = formattedValue ;
  }

  generateQRCode(): void {
    const selectedBank = this.bankList.find(bank => bank.shortName === this.selectedBankName);

    console.log('bank ', selectedBank);
    if (selectedBank) {


      const getBinUrl =  API_BASE_URL + `/getBin/${selectedBank.shortName}`;

      this.http.get(getBinUrl).pipe(
        map((response: any) => response.bin)
      ).subscribe((bin: string) => {
        this.qrForm.controls['bin'].setValue(bin);
        this.qrForm.patchValue({ headerGW: { bkCd: bin } }); // Assign bin value to bkCd field in request JSON
          console.log('Generating QR code...');


        this.generateQRCodeRequest();
      }, (error: any) => {
        console.log('Error getting bin:', error);
      });
    }else{

    console.log('Error');
    }
  }

  // Xử lý nhập tên chủ thẻ
  handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.toUpperCase();
    if (this.qrForm) {
      const customerNameControl = this.qrForm.get('customerName');
      if (customerNameControl) {
        customerNameControl.setValue(value);
      }
    }
  }

// Kiểm tra trường nhập số tài khoản
validateCardNumber(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input) {
    const value = input.value;
    const errorElement = document.getElementById("errorCustomerId");

    if (errorElement) {
      if (!/^[0-9]+$/.test(value)) {
        errorElement.style.display = "block";
      } else {
        errorElement.style.display = "none";
      }
    }
  }
}


  generateQRCodeRequest(): void {
    if (this.qrForm.valid) {
      const qrInfo = {
        serviceCode: this.qrForm.value.serviceCode,
        customerId: this.qrForm.value.customerId,
        transCurrency: '704',
        customerName: this.qrForm.value.customerName,
        countryCode: 'VN',
        additionInfo: this.qrForm.value.additionInfo,
        transAmount: this.qrForm.value.transAmount.replace(/[^0-9]/g, '')
      };

      const payload = {
        headerGW: {
          bkCd: this.qrForm.value.bin,
          brCd: 'HN',
          trnDt: '20230101',
          direction: 'O',
          reqResGb: 'REQ',
          refNo: '2023010109000000001',
          errCode: null,
          errDesc: null
        },
        data: {
          qrInfo,
          createdUser: 'anhtn',
          channel: 'M'
        }
      };

      this.http.post(API_GENQR, payload).subscribe(
        response => {
          // Handle the response from the API

          console.log('QR code generated successfully:', response);
          this.handleQRResponse(response);
        },
        error => {
          console.log('Error generating QR code:', error);
        }
      );
    }
  }


  handleQRResponse(response: any) {
    if (response && response.data && response.data.qrImage) {
      this.qrCodeData = response.data.qrImage;
    }
  }

  downloadImg(): void {
    const image = document.querySelector('.qr-card img') as HTMLImageElement;

    if (image) {
      const link = document.createElement('a');
      link.href = image.src;
      link.download = 'qr_code.png';
      link.target = '_blank';
      link.dispatchEvent(new MouseEvent('click'));
    }
  }
}
