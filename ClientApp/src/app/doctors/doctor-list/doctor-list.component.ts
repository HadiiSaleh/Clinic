import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Doctor } from '../../interfaces/doctor';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit, OnDestroy {

  // For the FormControl - Adding Doctor
  insertForm: FormGroup;
  dr_username: FormControl;
  dr_password: FormControl;
  ConfirmPassword: FormControl;
  dr_email: FormControl;
  dr_phone: FormControl;
  dr_fname: FormControl;
  dr_mname: FormControl;
  dr_lname: FormControl;
  dr_address: FormControl;
  dr_about: FormControl;
  dr_speciality: FormControl;
  dr_gender: FormControl;

  // Updating the Insurance
  updateForm: FormGroup;
  _dr_username: FormControl;
  _dr_email: FormControl;
  _dr_phone: FormControl;
  _dr_fname: FormControl;
  _dr_mname: FormControl;
  _dr_lname: FormControl;
  _dr_address: FormControl;
  _dr_about: FormControl;
  _dr_speciality: FormControl;
  _dr_gender: FormControl;
  dr_user_id: FormControl;


  // Add Modal
  @ViewChild('template') modal: TemplateRef<any>;

  // Update Modal
  @ViewChild('editTemplate') editmodal: TemplateRef<any>;

  // Error Modal
  @ViewChild('errortemplate') errormodal: TemplateRef<any>;

  // Modal properties
  modalMessage: string;
  modalError: string;
  modalRef: BsModalRef;
  modalErr: BsModalRef;
  selectedDoctor: Doctor;
  doctors$: Observable<Doctor[]>;
  doctors: Doctor[] = [];
  userRoleStatus: string;
  errorList: string[];
  
  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  phoneRegex = "[+][0-9]{3} [0-9]{8}";
  nameRegex = "^[A-Za-z]+$";
  passRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9_]).*$";


  constructor(private doctorService: DoctorService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private acct: LoginService) { }

  /// Load Add New doctor Modal
  onAddDoctor() {
    this.modalRef = this.modalService.show(this.modal);
  }

  // Method to Add new doctor
  onSubmit() {
    let newDoctor = this.insertForm.value;

    this.doctorService.insertDoctor(newDoctor).subscribe(
      result => {
        this.errorList = [];
        this.doctorService.clearCache();
        this.doctors$ = this.doctorService.getAll();

        this.doctors$.subscribe(newlist => {
          this.doctors = newlist;
          for (var i = 0; i < this.doctors.length; i++) {
            this.doctors[i].dr_name = this.doctors[i].dr_fname + " " + this.doctors[i].dr_mname + " " + this.doctors[i].dr_lname;
          }
          this.modalRef.hide();
          this.insertForm.reset();
          this.rerender();

        });
        console.log("New Doctor added");
        this.modalMessage = "New Doctor added";
        this.modalError = "New Doctor added";
        this.modalErr = this.modalService.show(this.errormodal)
      },
      error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalError = "Add Doctor was Unsuccessful";
        this.modalErr = this.modalService.show(this.errormodal)

      });

  }

  // We will use this method to destroy old table and re-render new table

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }

  // Update an Existing Doctor
  onUpdate() {
    let editDoctor = this.updateForm.value;
    this.doctorService.updateDoctor(editDoctor.dr_user_id, editDoctor).subscribe(
      result => {
        this.errorList = [];
        console.log('Doctor Updated');
        this.doctorService.clearCache();
        this.doctors$ = this.doctorService.getAll();
        this.doctors$.subscribe(updatedlist => {
          this.doctors = updatedlist;
          for (var i = 0; i < this.doctors.length; i++) {
            this.doctors[i].dr_name = this.doctors[i].dr_fname + " " + this.doctors[i].dr_mname + " " + this.doctors[i].dr_lname;
          }
          this.modalRef.hide();
          this.rerender();
        });
        console.log("Doctor Edited");
        this.modalMessage = "Doctor Edited";
        this.modalError = "Doctor Edited";
        this.modalErr = this.modalService.show(this.errormodal)
      },
      error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalError = "Edit Doctor was Unsuccessful";
        this.modalErr = this.modalService.show(this.errormodal)

      });
  }

  // Load the update Modal

  onUpdateModal(doctorEdit: Doctor): void {
    this.dr_user_id.setValue(doctorEdit.dr_user_id);
    this._dr_username.setValue(doctorEdit.dr_username);
    this._dr_fname.setValue(doctorEdit.dr_fname);
    this._dr_mname.setValue(doctorEdit.dr_mname);
    this._dr_lname.setValue(doctorEdit.dr_lname);
    this._dr_phone.setValue(doctorEdit.dr_phone);
    this._dr_email.setValue(doctorEdit.dr_email);
    this._dr_about.setValue(doctorEdit.dr_about);
    this._dr_address.setValue(doctorEdit.dr_address);
    this._dr_gender.setValue(doctorEdit.dr_gender);
    this._dr_speciality.setValue(doctorEdit.dr_speciality);

    this.updateForm.setValue({
      'dr_user_id': this.dr_user_id.value,
      'dr_username': this._dr_username.value,
      'dr_fname': this._dr_fname.value,
      'dr_mname': this._dr_mname.value,
      'dr_lname': this._dr_lname.value,
      'dr_phone': this._dr_phone.value,
      'dr_email': this._dr_email.value,
      'dr_about': this._dr_about.value,
      'dr_address': this._dr_address.value,
      'dr_speciality': this._dr_speciality.value,
      'dr_gender': this._dr_gender.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);

  }

  // Method to Delete the Doctor
  onDelete(doctor: Doctor): void {
    this.doctorService.deleteDoctor(doctor.dr_user_id).subscribe(result => {
      this.errorList = [];
      this.doctorService.clearCache();
      this.doctors$ = this.doctorService.getAll();
      this.doctors$.subscribe(newlist => {
        this.doctors = newlist;
        for (var i = 0; i < this.doctors.length; i++) {
          this.doctors[i].dr_name = this.doctors[i].dr_fname + " " + this.doctors[i].dr_mname + " " + this.doctors[i].dr_lname;
        }
        this.rerender();
      });
      console.log("Doctor Deleted");
      this.modalMessage = "Doctor Deleted";
      this.modalError = "Doctor Deleted";
      this.modalErr = this.modalService.show(this.errormodal)
    })
  }

  onSelect(doctor: Doctor): void {
    this.selectedDoctor = doctor;

    this.router.navigateByUrl("/doctors/" + doctor.dr_user_id);
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 9,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.doctors$ = this.doctorService.getAll();

    this.doctors$.subscribe(result => {
      this.doctors = result;

      for (var i = 0; i < this.doctors.length; i++) {
        this.doctors[i].dr_name = this.doctors[i].dr_fname + " " + this.doctors[i].dr_mname + " " + this.doctors[i].dr_lname;
      }

      this.chRef.detectChanges();

      this.dtTrigger.next();
    });

    this.acct.currentUserRole.subscribe(result => { this.userRoleStatus = result });

    this.errorList = [];

    // Modal Message
    this.modalMessage = "All Fields Are Mandatory";

    // Initializing Add doctor properties

    this.dr_username = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.dr_password = new FormControl('', [Validators.required, Validators.pattern(this.passRegex), Validators.maxLength(50), Validators.minLength(6)]);
    this.ConfirmPassword = new FormControl('', [Validators.required, this.MustMatch(this.dr_password)]);
    this.dr_email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(256)]);
    this.dr_phone = new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex), Validators.maxLength(100)]);
    this.dr_fname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.dr_mname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.dr_lname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.dr_gender = new FormControl('', [Validators.required]);
    this.dr_speciality = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]);
    this.dr_address = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]);
    this.dr_about = new FormControl('', [Validators.required, Validators.maxLength(400), Validators.minLength(5)]);

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

    // Initializing Update Comapany properties
    this.dr_user_id = new FormControl('', [Validators.required]);
    this._dr_username = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._dr_email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(256)]);
    this._dr_phone = new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex), Validators.maxLength(100)]);
    this._dr_fname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this._dr_mname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this._dr_lname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this._dr_gender = new FormControl('', [Validators.required]);
    this._dr_speciality = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]);
    this._dr_address = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]);
    this._dr_about = new FormControl('', [Validators.required, Validators.maxLength(400), Validators.minLength(5)]);

    this.updateForm = this.fb.group(
      {
        'dr_username': this._dr_username,
        'dr_email': this._dr_email,
        'dr_phone': this._dr_phone,
        'dr_fname': this._dr_fname,
        'dr_mname': this._dr_mname,
        'dr_lname': this._dr_lname,
        'dr_gender': this._dr_gender,
        'dr_speciality': this._dr_speciality,
        'dr_address': this._dr_address,
        'dr_about': this._dr_about,
        'dr_user_id': this.dr_user_id,
      });


  }

  ngOnDestroy() {
    // Do not forget to unsubscribe
    this.dtTrigger.unsubscribe();
  }

}
