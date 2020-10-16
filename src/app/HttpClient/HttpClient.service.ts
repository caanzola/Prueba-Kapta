import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  
export class HttpClientService {

    // Base url
    baseurl = 'https://pokeapi.co/api/v2/';
    baseurl2 = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1050";
  
    constructor(private http: HttpClient) { }

    // Http Headers
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }


    // POST
  Login(data): Observable<any> {
    return this.http.post<any>(this.baseurl + 'api/user/login/', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1)
    )
  }
  
   // GET
   GetPokemons(): Observable<any> {
    return this.http.get<any>(this.baseurl + 'pokemon/', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  // GET
  GetAllPokemons(): Observable<any> {
    return this.http.get<any>(this.baseurl2 + 'pokemon/', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  Get(url): Observable<any> {
    return this.http.get<any>(url, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }



   errorHandl(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}