import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient, private router: Router) { }

  // Url to access our Web API’s
  private baseUrlRegister: string = "/api/messages/addMessage";

  // Send Method
  send(Name: string, Email: string, subject: string, Message: string) {
    return this.http.post<any>(this.baseUrlRegister, { Name, Email, subject, Message}).pipe(map(result => {
      //registration was successful
      return result;

    }, error => {
      return error;
    }));
  }
}
