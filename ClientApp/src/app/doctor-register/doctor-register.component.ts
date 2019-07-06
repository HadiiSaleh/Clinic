import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.css']
})
export class DoctorRegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  // Properties
  insertForm: FormGroup;
  modalRef: BsModalRef;
  dr_username: FormControl;
  dr_password: FormControl;
  ConfirmPassword: FormControl;
  dr_email: FormControl;
  dr_phone: FormControl;
  dr_fname: FormControl;
  dr_mname: FormControl;
  dr_lname: FormControl;
  dr_gender: FormControl;
  dr_speciality: FormControl;
  dr_address: FormControl;
  dr_about: FormControl;

  errorList: string[];
  modalMessage: string;
  phoneRegex = "[+][0-9]{3} [0-9]{8}";
  nameRegex = "^[A-Za-z]+$";
  passRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9_]).*$";

  test: any[] = [];

  @ViewChild('template') modal: TemplateRef<any>;

  onSubmit() {

    let userDetails = this.insertForm.value;

    this.doctorService.register(userDetails.dr_fname, userDetails.dr_mname, userDetails.dr_lname, userDetails.dr_gender, userDetails.dr_username, userDetails.dr_password, userDetails.ConfirmPassword,
      userDetails.dr_phone, userDetails.dr_speciality, userDetails.dr_email, userDetails.dr_address, userDetails.dr_about).subscribe(result => {

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

  MustMatch(dr_passwordControl: AbstractControl): ValidatorFn {
    return (ConfirmPasswordControl: AbstractControl): { [key: string]: boolean } | null => {
      // return null if controls haven't initialised yet
      if (!dr_passwordControl && !ConfirmPasswordControl) {
        return null;
      }

      // return null if another validator has already found an error on the matchingControl
      if (ConfirmPasswordControl.hasError && !dr_passwordControl.hasError) {
        return null;
      }
      // set error on matchingControl if validation fails
      if (dr_passwordControl.value !== ConfirmPasswordControl.value) {
        return { 'mustMatch': true };
      }
      else {
        return null;
      }

    }
  }

  ngOnInit() {
    this.dr_username = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.dr_password = new FormControl('', [Validators.required, Validators.pattern(this.passRegex), Validators.maxLength(50), Validators.minLength(6)]);
    this.ConfirmPassword = new FormControl('', [Validators.required, this.MustMatch(this.dr_password)]);
    this.dr_email = new FormControl('', [Validators.required, Validators.email]);
    this.dr_phone = new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex)]);
    this.dr_fname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.dr_mname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.dr_lname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.dr_gender = new FormControl('', [Validators.required]);
    this.dr_speciality = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]);
    this.dr_address = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]);
    this.dr_about = new FormControl('', [Validators.required, Validators.maxLength(400), Validators.minLength(5)]);

    this.errorList = [];


    this.insertForm = this.fb.group(
      {
        'dr_username': this.dr_username,
        'dr_password': this.dr_password,
        'ConfirmPassword': this.ConfirmPassword,
        'dr_email': this.dr_email,
        'dr_phone': this.dr_phone,
        'dr_fname': this.dr_fname,
        'dr_mname': this.dr_mname,
        'dr_lname': this.dr_lname,
        'dr_gender': this.dr_gender,
        'dr_speciality': this.dr_speciality,
        'dr_address': this.dr_address,
        'dr_about': this.dr_about,
      });
  }

}
