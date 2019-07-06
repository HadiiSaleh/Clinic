import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient, private router: Router) { }

  // Url to access our Web API’s
  private baseUrlRegister: string = "/api/patients/addpatient";

  // Register Method
  register(pat_fname: string, pat_mname: string, pat_lname: string, pat_gender: string, pat_username: string, pat_password: string, ConfirmPassword: string,
    pat_phone: string, pat_blood_type: string, pat_email: string, pat_address: string, pat_birthday: Date, pat_picture: string, pat_insurance_company_name: string) {
    return this.http.post<any>(this.baseUrlRegister, { pat_fname, pat_mname, pat_lname, pat_gender, pat_username, pat_password, ConfirmPassword, pat_phone, pat_blood_type, pat_email, pat_address, pat_birthday, pat_picture, pat_insurance_company_name }).pipe(map(result => {
      //registration was successful
      return result;

    }, error => {
      return error;
    }));
  }
}
