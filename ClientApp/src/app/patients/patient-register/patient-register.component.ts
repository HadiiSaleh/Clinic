import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PatientService } from '../../services/patient.service';
import { Observable } from 'rxjs';
import { InsuranceService } from '../../services/insurance.service';
import { InsuranceCompany } from '../../interfaces/insurance-company';

export interface Blood {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.css']
})

export class PatientRegisterComponent implements OnInit {

  bloods: Array<string> = ['O+', 'O-', 'A+', 'A-', 'B+', 'AB+', 'AB-'];

  companies: InsuranceCompany[]=[];

  companies$: Observable<InsuranceCompany[]>;

  constructor(private fb: FormBuilder,
    private patientService: PatientService,
    private insuranceService: InsuranceService,
    private router: Router,
    private modalService: BsModalService) { }

  // Properties
  insertForm: FormGroup;
  modalRef: BsModalRef;
  pat_username: FormControl;
  pat_password: FormControl;
  ConfirmPassword: FormControl;
  pat_email: FormControl;
  pat_phone: FormControl;
  pat_fname: FormControl;
  pat_mname: FormControl;
  pat_lname: FormControl;
  pat_gender: FormControl;
  pat_blood_type: FormControl;
  pat_address: FormControl;
  pat_birthday: FormControl;
  pat_picture: FormControl;
  pat_insurance_company_name: FormControl;

  errorList: string[];
  modalMessage: string;
  phoneRegex = "[+][0-9]{3} [0-9]{8}";
  nameRegex = "^[A-Za-z]+$";
  passRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9_]).*$";

  test: any[] = [];

  @ViewChild('template') modal: TemplateRef<any>;

  onSubmit() {

    let userDetails = this.insertForm.value;

    this.patientService.register(userDetails.pat_fname, userDetails.pat_mname, userDetails.pat_lname, userDetails.pat_gender, userDetails.pat_username, userDetails.pat_password, userDetails.ConfirmPassword,
      userDetails.pat_phone, userDetails.pat_blood_type, userDetails.pat_email, userDetails.pat_address, userDetails.pat_birthday, userDetails.pat_picture, userDetails.pat_insurance_company_name).subscribe(result => {

        this.router.navigate(['/home']);
      }, error => {

        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          //console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalMessage = "Your Registration Was Unsuccessful";
        this.modalRef = this.modalService.show(this.modal)
      });
  }

  // Custom Validator

  MustMatch(pat_passwordControl: AbstractControl): ValidatorFn {
    return (ConfirmPasswordControl: AbstractControl): { [key: string]: boolean } | null => {
      // return null if controls haven't initialised yet
      if (!pat_passwordControl && !ConfirmPasswordControl) {
        return null;
      }

      // return null if another validator has already found an error on the matchingControl
      if (ConfirmPasswordControl.hasError && !pat_passwordControl.hasError) {
        return null;
      }
      // set error on matchingControl if validation fails
      if (pat_passwordControl.value !== ConfirmPasswordControl.value) {
        return { 'mustMatch': true };
      }
      else {
        return null;
      }

    }
  }

  ngOnInit() {

    this.companies$ = this.insuranceService.getAll();

    this.companies$.subscribe(result => {
        this.companies = result;
     
    });

    this.pat_username = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.pat_password = new FormControl('', [Validators.required, Validators.pattern(this.passRegex), Validators.maxLength(50), Validators.minLength(6)]);
    this.ConfirmPassword = new FormControl('', [Validators.required, this.MustMatch(this.pat_password)]);
    this.pat_email = new FormControl('', [Validators.required, Validators.email]);
    this.pat_phone = new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex)]);
    this.pat_fname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.pat_mname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.pat_lname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.pat_gender = new FormControl('', [Validators.required]);
    this.pat_blood_type = new FormControl('', [Validators.required]);
    this.pat_address = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]);
    this.pat_birthday = new FormControl('', [Validators.required]);
    this.pat_picture = new FormControl('', [Validators.required, Validators.maxLength(500), Validators.minLength(5)]);
    this.pat_insurance_company_name = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]);

    this.errorList = [];


    this.insertForm = this.fb.group(
      {
        'pat_username': this.pat_username,
        'pat_password': this.pat_password,
        'ConfirmPassword': this.ConfirmPassword,
        'pat_email': this.pat_email,
        'pat_phone': this.pat_phone,
        'pat_fname': this.pat_fname,
        'pat_mname': this.pat_mname,
        'pat_lname': this.pat_lname,
        'pat_gender': this.pat_gender,
        'pat_blood_type': this.pat_blood_type,
        'pat_address': this.pat_address,
        'pat_birthday': this.pat_birthday,
        'pat_picture': this.pat_picture,
        'pat_insurance_company_name': this.pat_insurance_company_name,
      });
  }

}
