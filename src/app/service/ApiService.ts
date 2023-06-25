import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/infogw/qr/v1/genAdQR'; // Thay thế bằng URL API của bạn

  constructor(private http: HttpClient) { }

  createQRCode(text: string) {
    const requestBody = {
      headerGW: {
        bkCd: '970415',
        errCode: null,
        errDesc: null
      },
      data: {
        qrInfo: {
          adType: 'URL',
          text: text
        },
        createdUser: 'huyle',
        channel: 'M'
      }
    };

    return this.http.post(`${this.apiUrl}`, requestBody);
  }
}
