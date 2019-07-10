import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Patient } from 'src/app/interfaces/patient';
import { PatientService } from 'src/app/services/patient.service';
import { InsuranceCompany } from 'src/app/interfaces/insurance-company';
import { InsuranceService } from 'src/app/services/insurance.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy{

  // For the FormControl - Adding Patient
  insertForm: FormGroup;
  pat_username: FormControl;
  pat_password: FormControl;
  ConfirmPassword: FormControl;
  pat_email: FormControl;
  pat_phone: FormControl;
  pat_fname: FormControl;
  pat_mname: FormControl;
  pat_lname: FormControl;
  pat_address: FormControl;
  pat_picture: FormControl;
  pat_blood_type: FormControl;
  pat_gender: FormControl;
  pat_insurance_company_name: FormControl;
  pat_birthday: FormControl;

  // Updating the Insurance
  updateForm: FormGroup;
  _pat_username: FormControl;
  _pat_email: FormControl;
  _pat_phone: FormControl;
  _pat_fname: FormControl;
  _pat_mname: FormControl;
  _pat_lname: FormControl;
  _pat_address: FormControl;
  _pat_picture: FormControl;
  _pat_blood_type: FormControl;
  _pat_gender: FormControl;
  _pat_insurance_company_name: FormControl;
  _pat_birthday: FormControl;
  pat_user_id: FormControl;


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
  selectedPatient: Patient;
  patients$: Observable<Patient[]>;
  patients: Patient[] = [];
  userRoleStatus: string;
  errorList: string[];

  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  phoneRegex = "[+][0-9]{3} [0-9]{8}";
  nameRegex = "^[A-Za-z]+$";
  passRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9_]).*$";

  bloods: Array<string> = ['O+', 'O-', 'A+', 'A-', 'B+', 'AB+', 'AB-'];

  companies: InsuranceCompany[] = [];

  companies$: Observable<InsuranceCompany[]>;

  constructor(private patientService: PatientService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private insuranceService: InsuranceService,
    private acct: LoginService) { }

  /// Load Add New patient Modal
  onAddPatient() {
    this.modalRef = this.modalService.show(this.modal);
  }

  // Method to Add new patient
  onSubmit() {
    let newPatient = this.insertForm.value;

    this.patientService.insertPatient(newPatient).subscribe(
      result => {
        this.errorList = [];
        this.patientService.clearCache();
        this.patients$ = this.patientService.getAll();

        this.patients$.subscribe(newlist => {
          this.patients = newlist;
          
          this.modalRef.hide();
          this.insertForm.reset();
          this.rerender();

        });
        console.log("New Patient added");
        this.modalMessage = "New Patient added";
        this.modalError = "New Patient added";
        this.modalErr = this.modalService.show(this.errormodal)
      },
      error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalError = "Add Patient was Unsuccessful";
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

  // Update an Existing Patient
  onUpdate() {
    let editPatient = this.updateForm.value;
    this.patientService.updatePatient(editPatient.pat_user_id, editPatient).subscribe(
      result => {
        this.errorList = [];
        console.log('Patient Updated');
        this.patientService.clearCache();
        this.patients$ = this.patientService.getAll();
        this.patients$.subscribe(updatedlist => {
          this.patients = updatedlist;

          this.modalRef.hide();
          this.rerender();
        });
        console.log("Patient Edited");
        this.modalMessage = "Patient Edited";
        this.modalError = "Patient Edited";
        this.modalErr = this.modalService.show(this.errormodal)
      },
      error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalError = "Edit Patient was Unsuccessful";
        this.modalErr = this.modalService.show(this.errormodal)

      });
  }

  // Load the update Modal

  onUpdateModal(patientEdit: Patient): void {
    this.pat_user_id.setValue(patientEdit.pat_user_id);
    this._pat_username.setValue(patientEdit.pat_username);
    this._pat_fname.setValue(patientEdit.pat_fname);
    this._pat_mname.setValue(patientEdit.pat_mname);
    this._pat_lname.setValue(patientEdit.pat_lname);
    this._pat_phone.setValue(patientEdit.pat_phone);
    this._pat_email.setValue(patientEdit.pat_email);
    this._pat_picture.setValue(patientEdit.pat_picture);
    this._pat_address.setValue(patientEdit.pat_address);
    this._pat_gender.setValue(patientEdit.pat_gender);
    this._pat_blood_type.setValue(patientEdit.pat_blood_type);
    this._pat_birthday.setValue(patientEdit.pat_birthday);
    this._pat_insurance_company_name.setValue(patientEdit.pat_insurance_company_name);

    this.updateForm.setValue({
      'pat_user_id': this.pat_user_id.value,
      'pat_username': this._pat_username.value,
      'pat_fname': this._pat_fname.value,
      'pat_mname': this._pat_mname.value,
      'pat_lname': this._pat_lname.value,
      'pat_phone': this._pat_phone.value,
      'pat_email': this._pat_email.value,
      'pat_picture': this._pat_picture.value,
      'pat_address': this._pat_address.value,
      'pat_blood_type': this._pat_blood_type.value,
      'pat_gender': this._pat_gender.value,
      'pat_birthday': this._pat_birthday.value,
      'pat_insurance_company_name': this._pat_insurance_company_name.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);

  }

  // Method to Delete the Patient
  onDelete(patient: Patient): void {
    this.patientService.deletePatient(patient.pat_user_id).subscribe(result => {
      this.errorList = [];
      this.patientService.clearCache();
      this.patients$ = this.patientService.getAll();
      this.patients$.subscribe(newlist => {
        this.patients = newlist;
        
        this.rerender();
      });
      console.log("Patient Deleted");
      this.modalMessage = "Patient Deleted";
      this.modalError = "Patient Deleted";
      this.modalErr = this.modalService.show(this.errormodal)
    })
  }

  onSelect(patient: Patient): void {
    this.selectedPatient = patient;

    this.router.navigateByUrl("/patients/" + patient.pat_user_id);
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 9,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.patients$ = this.patientService.getAll();

    this.patients$.subscribe(result => {
      this.patients = result;

      this.chRef.detectChanges();

      this.dtTrigger.next();
    });

    this.acct.currentUserRole.subscribe(result => { this.userRoleStatus = result });

    //List of Inurance Companies
    this.companies$ = this.insuranceService.getAll();

    this.companies$.subscribe(result => {
      this.companies = result;

    });

    let validateImageUrl: string = '^(https?:\/\/.*\.(?:png|jpg|jpeg))$';

    this.errorList = [];

    // Modal Message
    this.modalMessage = "All Fields Are Mandatory";

    // Initializing Add patient properties

    this.pat_username = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.pat_password = new FormControl('', [Validators.required, Validators.pattern(this.passRegex), Validators.maxLength(50), Validators.minLength(6)]);
    this.ConfirmPassword = new FormControl('', [Validators.required, this.MustMatch(this.pat_password)]);
    this.pat_email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(256)]);
    this.pat_phone = new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex), Validators.maxLength(100)]);
    this.pat_fname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.pat_mname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.pat_lname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.pat_gender = new FormControl('', [Validators.required]);
    this.pat_blood_type = new FormControl('', [Validators.required, Validators.maxLength(4)]);
    this.pat_address = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]);
    this.pat_picture = new FormControl('', [Validators.required, Validators.pattern(validateImageUrl), Validators.maxLength(500), Validators.minLength(5)]);
    this.pat_birthday = new FormControl('', [Validators.required]);
    this.pat_insurance_company_name = new FormControl('', [Validators.required, Validators.maxLength(100)]);

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
        'pat_picture': this.pat_picture,
        'pat_insurance_company_name': this.pat_insurance_company_name,
        'pat_birthday': this.pat_birthday,
      });

    // Initializing Update Patient properties
    this.pat_user_id = new FormControl('', [Validators.required]);
    this._pat_username = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._pat_email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]);
    this._pat_phone = new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex), Validators.maxLength(100)]);
    this._pat_fname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this._pat_mname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this._pat_lname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this._pat_gender = new FormControl('', [Validators.required]);
    this._pat_blood_type = new FormControl('', [Validators.required, Validators.maxLength(4)]);
    this._pat_address = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]);
    this._pat_picture = new FormControl('', [Validators.required, Validators.pattern(validateImageUrl), Validators.maxLength(400), Validators.minLength(5)]);
    this._pat_birthday = new FormControl('', [Validators.required]);
    this._pat_insurance_company_name = new FormControl('', [Validators.required, Validators.maxLength(100)]);

    this.updateForm = this.fb.group(
      {
        'pat_username': this._pat_username,
        'pat_email': this._pat_email,
        'pat_phone': this._pat_phone,
        'pat_fname': this._pat_fname,
        'pat_mname': this._pat_mname,
        'pat_lname': this._pat_lname,
        'pat_gender': this._pat_gender,
        'pat_blood_type': this._pat_blood_type,
        'pat_address': this._pat_address,
        'pat_picture': this._pat_picture,
        'pat_user_id': this.pat_user_id,
        'pat_insurance_company_name': this._pat_insurance_company_name,
        'pat_birthday': this._pat_birthday,
      });


  }

  ngOnDestroy() {
    // Do not forget to unsubscribe
    this.dtTrigger.unsubscribe();
  }

}
