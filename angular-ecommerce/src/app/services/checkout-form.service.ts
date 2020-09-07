import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CheckoutFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    // build an array for "Month" dropdown list

    for (let m = startMonth; m <= 12; m++) {
      data.push(m);
    }

    return of(data); // wrap data object as an Observable

  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    // build an array for Year drop down list

    const startYear: number = new Date().getFullYear();

    const endYear: number = startYear + 10;

    for (let y = startYear; y <= endYear; y++) {
      data.push(y);
    }

    return of(data);


  }
}
