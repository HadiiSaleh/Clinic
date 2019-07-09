import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { flatMap, first, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InsuranceCompany } from '../interfaces/insurance-company';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
    min: any;

  constructor(private http: HttpClient, private router: Router) { }

  // Url to access our Web API’s
  private baseUrlRegister: string = "/api/insurance/AddInsurance_company";
  private baseUrlGetAll: string = "/api/insurance/GetInsurance_companiesAsync";
  private updateUrl: string = "/api/insurance/UpdateInsurance_company";
  private deleteUrl: string = "/api/insurance/DeleteInsurance_company";

  private InsuranceCompanies$: Observable<InsuranceCompany[]>;

  // Insert the Company
  insertCompany(newCompany: InsuranceCompany): Observable<InsuranceCompany> {
    return this.http.post<InsuranceCompany>(this.baseUrlRegister, newCompany);
  }

  // Update the Company

  updateCompany(id: string, editCompany: InsuranceCompany): Observable<InsuranceCompany> {
    return this.http.put<InsuranceCompany>(this.updateUrl +"/"+ id, editCompany);
  }

  // Delete Company

  deleteCompany(id: string): Observable<any> {
    return this.http.delete(this.deleteUrl + "/" + id);
  }

  //Get All Items Method

  getAll(): Observable<InsuranceCompany[]> {
    if (!this.InsuranceCompanies$) {
      this.InsuranceCompanies$ = this.http.get<InsuranceCompany[]>(this.baseUrlGetAll).pipe(shareReplay());
    }

    // if companies cache exists return it
    return this.InsuranceCompanies$;
  }

  // Get Insurance company by its ID
  getCompanyById(id: string): Observable<InsuranceCompany> {
    return this.getAll().pipe(flatMap(result => result), first(insuranceCompany => insuranceCompany.cid == id));
  }

  // Clear Cache
  clearCache() {
    this.InsuranceCompanies$ = null;
  }
}
