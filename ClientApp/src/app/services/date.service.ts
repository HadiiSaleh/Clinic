import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { flatMap, first, shareReplay } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { Date } from '../interfaces/date';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private http: HttpClient, private router: Router) { }

  // Url to access our Web API’s
  private baseUrlRegister: string = "/api/dates/AddDate";
  private baseUrlGetAll: string = "/api/dates/GetDates";
  private updateUrl: string = "/api/dates/UpdateDate";
  private deleteUrl: string = "/api/dates/DeleteDate";

  private Dates$: Observable<Date[]>;

  // Insert the Date
  insertDate(newDate: Date): Observable<Date> {
    return this.http.post<Date>(this.baseUrlRegister, newDate);
  }

  // Update the Date

  updateDate(id: number, editDate: Date): Observable<Date> {
    return this.http.put<Date>(this.updateUrl + "/" + id, editDate);
  }

  // Delete Date

  deleteDate(id: number): Observable<any> {
    return this.http.delete(this.deleteUrl + "/" + id);
  }

  //Get All Items Method

  getAll(): Observable<Date[]> {
    if (!this.Dates$) {
      this.Dates$ = this.http.get<Date[]>(this.baseUrlGetAll).pipe(shareReplay());
    }

    // if Date cache exists return it
    return this.Dates$;
  }

  // Get Date its ID
  getDateById(id: number): Observable<Date> {
    return this.getAll().pipe(flatMap(result => result), first(date => date.date_id == id));
  }

  // Clear Cache
  clearCache() {
    this.Dates$ = null;
  }
}
