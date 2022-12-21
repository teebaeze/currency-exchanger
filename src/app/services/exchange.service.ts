import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, mergeMap, concatMap, forkJoin, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Convert } from '../models/convert.model';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor(private http : HttpClient) { }

  getSymbols():Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/symbols`)
    .pipe(
      tap(data => data
      )
    )
  }
  ConvertSymbols(params:{to:string, from:string, amount:number,  }):Observable<any>{
    console.log(params);
    // 
    return this.http.get<Convert>(`${environment.apiUrl}/convert`,{ params: params })
    .pipe(
      tap(data => data
      )
    )
  }
  getLatestRates(base:string, symbols:string):Observable<any>{
   let params = {
     base: base,
     symbols:symbols
   }
    // console.log(params);
    
    return this.http.get<Convert>(`${environment.apiUrl}/latest`,{ params: params })
    .pipe(
      tap(data => data
      )
    )
  }
  
}