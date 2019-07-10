import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { flatMap, first, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Patient } from '../interfaces/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient, private router: Router) { }

  // Url to access our Web API’s
  private baseUrlRegister: string = "/api/patients/AddPatient";
  private baseUrlGetAll: string = "/api/patients/GetPatientsAsync";
  private updateUrl: string = "/api/patients/UpdatePatient";
  private deleteUrl: string = "/api/patients/DeletePatient";

  private Patients$: Observable<Patient[]>;

  // Insert the Patient
  insertPatient(newPatient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrlRegister, newPatient);
  }

  // Update the Patient

  updatePatient(id: string, editPatient: Patient): Observable<Patient> {
    return this.http.put<Patient>(this.updateUrl + "/" + id, editPatient);
  }

  // Delete Patient

  deletePatient(id: string): Observable<any> {
    return this.http.delete(this.deleteUrl + "/" + id);
  }

  //Get All Items Method

  getAll(): Observable<Patient[]> {
    if (!this.Patients$) {
      this.Patients$ = this.http.get<Patient[]>(this.baseUrlGetAll).pipe(shareReplay());
    }

    // if Patient cache exists return it
    return this.Patients$;
  }

  // Get Patient its ID
  getPatientById(id: string): Observable<Patient> {
    return this.getAll().pipe(flatMap(result => result), first(patient => patient.pat_user_id == id));
  }

  // Clear Cache
  clearCache() {
    this.Patients$ = null;
  }
}
