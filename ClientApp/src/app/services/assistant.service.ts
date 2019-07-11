import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { flatMap, first, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Assistant } from '../interfaces/assistant';
import { Doctor } from '../interfaces/doctor';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  constructor(private http: HttpClient, private router: Router) { }

  // Url to access our Web API’s
  private baseUrlRegister: string = "/api/assistants/addAssistant";
  private baseUrlGetAll: string = "/api/assistants/GetAssistantsAsync";
  private updateUrl: string = "/api/assistants/UpdateAssistant";
  private deleteUrl: string = "/api/assistants/DeleteAssistant";
  private baseUrlGetDoctorByUsername: string = "/api/assistants/GetDoctorByUsername";

  private Assistants$: Observable<Assistant[]>;

  // Insert the Assistant
  insertAssistant(newAssistant: Assistant): Observable<Assistant> {
    return this.http.post<Assistant>(this.baseUrlRegister, newAssistant);
  }

  // Update the Assistant

  updateAssistant(id: string, editAssistant: Assistant): Observable<Assistant> {
    return this.http.put<Assistant>(this.updateUrl + "/" + id, editAssistant);
  }

  // Delete Assistant

  deleteAssistant(id: string): Observable<any> {
    return this.http.delete(this.deleteUrl + "/" + id);
  }

  //Get All Items Method

  getAll(): Observable<Assistant[]> {
    if (!this.Assistants$) {
      this.Assistants$ = this.http.get<Assistant[]>(this.baseUrlGetAll).pipe(shareReplay());
    }

    // if Assistant cache exists return it
    return this.Assistants$;
  }

  // Get Doctor the username of the assistant
  getDoctorByUsername(username: string): Observable<Doctor> {
    return this.http.get<Doctor>(this.baseUrlGetDoctorByUsername + "/" + username);
  }

  // Get Assistant its ID
  getAssistantById(id: string): Observable<Assistant> {
    return this.getAll().pipe(flatMap(result => result), first(assistant => assistant.as_user_id == id));
  }

  // Clear Cache
  clearCache() {
    this.Assistants$ = null;
  }
}
