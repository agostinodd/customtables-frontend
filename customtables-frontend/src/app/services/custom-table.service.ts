import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {CustomTable} from '../Models/custom-table';

@Injectable({
  providedIn: 'root'
})
export class CustomTableService {

  constructor(private httpClient: HttpClient) {
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE',
      accept: 'application/json'
    });

  }

  httpHeader: HttpHeaders;

  existsCustomTable(ownerMail: string): Promise<any> {
    return this.httpClient.post('/tables-management/exists"', { ownerMail}, {headers: this.httpHeader}).toPromise();
  }

  saveCustomTable(table: CustomTable): Promise<HttpResponse<any>> {
    return this.httpClient.post('/tables-management/save', table, {headers: this.httpHeader, observe: 'response'}).toPromise();
  }

  newCustomTable(table: CustomTable): Promise<HttpResponse<any>> {
    return this.httpClient.post('/tables-management/create', table, {headers: this.httpHeader, observe: 'response'}).toPromise();
  }

  getCustomTable(ownerMails: string): Promise<CustomTable> {
    return this.httpClient.post<CustomTable>('/tables-management/get', { ownerMail: ownerMails}, {headers: this.httpHeader}).toPromise();
  }

  deleteCustomTable(id: string): Promise<HttpResponse<any>> {
    return this.httpClient.post<HttpResponse<any>>('/tables-management/delete', {id}, {headers: this.httpHeader, observe: 'response'}).toPromise();
  }
}
