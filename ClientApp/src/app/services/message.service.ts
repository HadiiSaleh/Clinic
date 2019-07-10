import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { flatMap, first, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient, private router: Router) { }

  // Url to access our Web API’s
  private baseUrlSend: string = "/api/messages/AddMessage";
  private baseUrlGetAll: string = "/api/messages/GetMessages";
  private deleteUrl: string = "/api/messages/DeleteMessage";

  private Messages$: Observable<Message[]>;

  // Send Method
  send(newMessage: Message): Observable<Message> {
    return this.http.post<Message>(this.baseUrlSend, newMessage);
  }

  // Delete Message

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(this.deleteUrl + "/" + id);
  }

  //Get All Items Method

  getAll(): Observable<Message[]> {
    if (!this.Messages$) {
      this.Messages$ = this.http.get<Message[]>(this.baseUrlGetAll).pipe(shareReplay());
    }

    // if Message cache exists return it
    return this.Messages$;
  }

  // Get Message its ID
  getMessageById(id: number): Observable<Message> {
    return this.getAll().pipe(flatMap(result => result), first(message => message.m_id == id));
  }

  // Clear Cache
  clearCache() {
    this.Messages$ = null;
  }
}
