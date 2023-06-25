import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as QRCode from 'qrcode';
import { API_GENQR_ADS } from '../../common/constants';

@Component({
  selector: 'app-gen-qr',
  templateUrl: './gen-qr.component.html',
  styleUrls: ['./gen-qr.component.css']
})
export class GenQRComponent implements AfterViewInit {
  @ViewChild('qrCodeCanvas', { static: false }) qrCodeCanvas: ElementRef<HTMLCanvasElement> | undefined;
  qrCodeData: string = '';
  content: string = '';
  isError: boolean = false;
  username = localStorage.getItem('username');
  download: any;

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {}

// Hàm kiểm tra xem nội dung có phải là URL hay không
  isURL(content: string): boolean {
    // Biểu thức chính quy để kiểm tra URL
    const urlPattern = /^(http[s]?:\/\/)?(www\.)?[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+(\S*)$/;
    urlPattern.test(content);
    return urlPattern.test(content);
    // Trả về true nếu là URL, ngược lại trả về false
  }

  generateQRCode() {
    this.isError = false; // Reset the error flag
    if (!this.content) {
      this.isError = true; // Set the error flag if content is empty
      return;
    }

    const adType = this.isURL(this.content) ? 'URL' : 'TEXT';

    const requestBody = {
      headerGW: {
        bkCd: '970415',
        errCode: null,
        errDesc: null
      },
      data: {
        qrInfo: {
          adType: adType,
          text: this.content,
        },
        createdUser: this.username,
        channel: 'M'
      }
    };
    console.log('Sending request:', requestBody);

    this.http.post(API_GENQR_ADS, requestBody).subscribe(
      response => {
        console.log('Received response:', response);
        this.handleQRResponse(response);
      },
      error => {
        console.error('Lỗi khi tạo mã QR:', error);
        this.isError = true; // Set the error flag if there is an error in the HTTP request
      }
    );
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
