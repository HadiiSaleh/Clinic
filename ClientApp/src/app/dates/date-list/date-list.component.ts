import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Date } from 'src/app/interfaces/date';
import { DateService } from 'src/app/services/date.service';
import { Doctor } from 'src/app/interfaces/doctor';
import { DoctorService } from 'src/app/services/doctor.service';
import { Patient } from 'src/app/interfaces/patient';
import { PatientService } from 'src/app/services/patient.service';
import { Assistant } from 'src/app/interfaces/assistant';
import { AssistantService } from 'src/app/services/assistant.service';

@Component({
  selector: 'app-date-list',
  templateUrl: './date-list.component.html',
  styleUrls: ['./date-list.component.css']
})
export class DateListComponent implements OnInit, OnDestroy {

  // For the FormControl - Adding Date
  insertForm: FormGroup;
  date_pat_id: FormControl;
  date_dateTime: FormControl;
  date_dr_id: FormControl;

  // Updating the Insurance
  updateForm: FormGroup;
  _date_pat_id: FormControl;
  _date_dateTime: FormControl;
  date_id: FormControl;
  _date_dr_id: FormControl;


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
  selectedDate: Date;
  dates$: Observable<Date[]>;
  dates: Date[] = [];
  userRoleStatus: string;
  userNameStatus: string;
  currentDoctor$: Observable<Doctor>;
  currentDoctor: Doctor;
  errorList: string[];

  currentDoctorName: string;

  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  patients: Patient[] = [];

  patients$: Observable<Patient[]>;

  constructor(private dateService: DateService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private assistantService: AssistantService,
    private acct: LoginService) { }

  /// Load Add New date Modal
  onAddDate(): void {

    this.date_dr_id.setValue(this.currentDoctorName);

    this.insertForm.setValue({
      'date_dr_id': this.date_dr_id.value,
      'date_pat_id': this.date_pat_id,
      'date_dateTime': this.date_dateTime,
    });

    this.modalRef = this.modalService.show(this.modal);
  }

  // Method to Add new date
  onSubmit() {
    let newDate = this.insertForm.value;

    newDate.date_dr_id = this.currentDoctor.dr_id;

    this.dateService.insertDate(newDate).subscribe(
      result => {
        this.errorList = [];
        this.dateService.clearCache();
        this.dates$ = this.dateService.getAll();

        this.dates$.subscribe(newlist => {
          this.dates = newlist;

          this.modalRef.hide();
          this.insertForm.reset();
          this.rerender();

        });
        console.log("New Date added");
        this.modalMessage = "New Date added";
        this.modalError = "New Date added";
        this.modalErr = this.modalService.show(this.errormodal)
      },
      error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalError = "Add Date was Unsuccessful";
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

  // Update an Existing Date
  onUpdate() {
    let editDate = this.updateForm.value;
    this.dateService.updateDate(editDate.date_id, editDate).subscribe(
      result => {
        this.errorList = [];
        console.log('Date Updated');
        this.dateService.clearCache();
        this.dates$ = this.dateService.getAll();
        this.dates$.subscribe(updatedlist => {
          this.dates = updatedlist;

          this.modalRef.hide();
          this.rerender();
        });
        console.log("Date Edited");
        this.modalMessage = "Date Edited";
        this.modalError = "Date Edited";
        this.modalErr = this.modalService.show(this.errormodal)
      },
      error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalError = "Edit Date was Unsuccessful";
        this.modalErr = this.modalService.show(this.errormodal)

      });
  }

  // Load the update Modal

  onUpdateModal(dateEdit: Date): void {
    this.date_id.setValue(dateEdit.date_id);
    this._date_dr_id.setValue(this.currentDoctor.dr_id);
    this._date_pat_id.setValue(dateEdit.date_pat_id);
    this._date_dateTime.setValue(dateEdit.date_dateTime);

    this.updateForm.setValue({
      'date_id': this.date_id.value,
      'date_dr_id': this._date_dr_id.value,
      'date_pat_id': this._date_pat_id.value,
      'date_dateTime': this._date_dateTime.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);

  }

  // Method to Delete the Date
  onDelete(date: Date): void {
    this.dateService.deleteDate(date.date_id).subscribe(result => {
      this.errorList = [];
      this.dateService.clearCache();
      this.dates$ = this.dateService.getAll();
      this.dates$.subscribe(newlist => {
        this.dates = newlist;

        this.rerender();
      });
      console.log("Date Deleted");
      this.modalMessage = "Date Deleted";
      this.modalError = "Date Deleted";
      this.modalErr = this.modalService.show(this.errormodal)
    })
  }

  onSelect(date: Date): void {
    this.selectedDate = date;

    this.router.navigateByUrl("/dates/" + date.date_id);
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 9,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.dates$ = this.dateService.getAll();

    this.dates$.subscribe(result => {
      this.dates = result;

      this.chRef.detectChanges();

      this.dtTrigger.next();
    });

    this.acct.currentUserRole.subscribe(result => { this.userRoleStatus = result });

    this.acct.currentUserName.subscribe(result => { this.userNameStatus = result });

    this.currentDoctor$ = this.assistantService.getDoctorByUsername(this.userNameStatus);

    this.currentDoctor$.subscribe(result => {
      this.currentDoctor = result;
      this.currentDoctorName = this.currentDoctor.dr_fname + " " + this.currentDoctor.dr_mname + " " + this.currentDoctor.dr_lname;

    });

    
    //List of patients
    this.patients$ = this.patientService.getAll();

    this.patients$.subscribe(result => {
      this.patients = result;

    });

    this.errorList = [];

    // Modal Message
    this.modalMessage = "All Fields Are Mandatory";

    // Initializing Add date properties
    this.date_dr_id = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.date_pat_id = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.date_dateTime = new FormControl('', [Validators.required, Validators.maxLength(50)]);
 
    this.insertForm = this.fb.group(
      {
        'date_dr_id': this.date_dr_id,
        'date_pat_id': this.date_pat_id,
        'date_dateTime': this.date_dateTime,
      });

    // Initializing Update Date properties
    this.date_id = new FormControl('', [Validators.required]);
    this._date_dr_id = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._date_pat_id = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._date_dateTime = new FormControl('', [Validators.required, Validators.maxLength(50)]);

    this.updateForm = this.fb.group(
      {
        'date_id': this.date_id,
        'date_dr_id': this._date_dr_id,
        'date_pat_id': this._date_pat_id,
        'date_dateTime': this._date_dateTime,
      });
    
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe
    this.dtTrigger.unsubscribe();
  }

}
