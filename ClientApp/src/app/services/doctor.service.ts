import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { flatMap, first, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Doctor } from '../interfaces/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient, private router: Router) { }

  // Url to access our Web API’s
  private baseUrlRegister: string = "/api/doctors/adddoctor";
  private baseUrlGetAll: string = "/api/doctors/GetDoctorsAsync";
  private updateUrl: string = "/api/doctors/UpdateDoctor";
  private deleteUrl: string = "/api/doctors/DeleteDoctor";

  private Doctors$: Observable<Doctor[]>;

  // Insert the Doctor
  insertDoctor(newDoctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.baseUrlRegister, newDoctor);
  }

  // Update the Doctor

  updateDoctor(id: string, editDoctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(this.updateUrl + "/" + id, editDoctor);
  }

  // Delete Doctor

  deleteDoctor(id: string): Observable<any> {
    return this.http.delete(this.deleteUrl + "/" + id);
  }

  //Get All Items Method

  getAll(): Observable<Doctor[]> {
    if (!this.Doctors$) {
      this.Doctors$ = this.http.get<Doctor[]>(this.baseUrlGetAll).pipe(shareReplay());
    }

    // if Doctor cache exists return it
    return this.Doctors$;
  }

  // Get Doctor its ID
  getDoctorById(id: string): Observable<Doctor> {
    return this.getAll().pipe(flatMap(result => result), first(doctor => doctor.dr_user_id == id));
  }

  // Clear Cache
  clearCache() {
    this.Doctors$ = null;
  }
}
