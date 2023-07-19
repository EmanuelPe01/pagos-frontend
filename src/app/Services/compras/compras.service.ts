import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Buy, url } from 'src/app/Models';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(
    private http: HttpClient
  ) { }

  saveBuy(buy: Buy)
  {
    return this.http.post(url + 'createBuy', buy);
  }

  editBuy(id:number, buy: any)
  {
    return this.http.put(url + 'editBuy/' + id.toString(), buy);
  }

  deleteBuy(id: number)
  {
    return this.http.delete(url + 'deleteBuy/' + id.toString())
  }
}
