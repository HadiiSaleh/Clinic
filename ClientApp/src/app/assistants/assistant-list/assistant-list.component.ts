import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Assistant } from 'src/app/interfaces/assistant';
import { AssistantService } from 'src/app/services/assistant.service';
import { Doctor } from 'src/app/interfaces/doctor';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-assistant-list',
  templateUrl: './assistant-list.component.html',
  styleUrls: ['./assistant-list.component.css']
})
export class AssistantListComponent implements OnInit, OnDestroy {

  // For the FormControl - Adding Assistant
  insertForm: FormGroup;
  as_username: FormControl;
  as_password: FormControl;
  ConfirmPassword: FormControl;
  as_email: FormControl;
  as_phone: FormControl;
  as_fname: FormControl;
  as_mname: FormControl;
  as_lname: FormControl;
  as_dr_id: FormControl;

  // Updating the Assistant
  updateForm: FormGroup;
  _as_username: FormControl;
  _as_email: FormControl;
  _as_phone: FormControl;
  _as_fname: FormControl;
  _as_mname: FormControl;
  _as_lname: FormControl;
  _as_dr_id: FormControl;
  as_user_id: FormControl;


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
  selectedAssistant: Assistant;
  assistants$: Observable<Assistant[]>;
  assistants: Assistant[] = [];
  userRoleStatus: string;
  errorList: string[];

  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  phoneRegex = "[+][0-9]{3} [0-9]{8}";
  nameRegex = "^[A-Za-z]+$";
  passRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9_]).*$";

  doctors: Doctor[] = [];

  doctors$: Observable<Doctor[]>;

  constructor(private assistantService: AssistantService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private doctorService: DoctorService,
    private acct: LoginService) { }

  /// Load Add New assistant Modal
  onAddAssistant() {
    this.modalRef = this.modalService.show(this.modal);
  }

  // Method to Add new assistant
  onSubmit() {
    let newAssistant = this.insertForm.value;

    this.assistantService.insertAssistant(newAssistant).subscribe(
      result => {
        this.errorList = [];
        this.assistantService.clearCache();
        this.assistants$ = this.assistantService.getAll();

        this.assistants$.subscribe(newlist => {
          this.assistants = newlist;
          
          this.modalRef.hide();
          this.insertForm.reset();
          this.rerender();

        });
        console.log("New Assistant added");
        this.modalMessage = "New Assistant added";
        this.modalError = "New Assistant added";
        this.modalErr = this.modalService.show(this.errormodal)
      },
      error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalError = "Add Assistant was Unsuccessful";
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

  // Update an Existing Assistant
  onUpdate() {
    let editAssistant = this.updateForm.value;
    this.assistantService.updateAssistant(editAssistant.as_user_id, editAssistant).subscribe(
      result => {
        this.errorList = [];
        console.log('Assistant Updated');
        this.assistantService.clearCache();
        this.assistants$ = this.assistantService.getAll();
        this.assistants$.subscribe(updatedlist => {
          this.assistants = updatedlist;
          
          this.modalRef.hide();
          this.rerender();
        });
        console.log("Assistant Edited");
        this.modalMessage = "Assistant Edited";
        this.modalError = "Assistant Edited";
        this.modalErr = this.modalService.show(this.errormodal)
      },
      error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalError = "Edit Assistant was Unsuccessful";
        this.modalErr = this.modalService.show(this.errormodal)

      });
  }

  // Load the update Modal

  onUpdateModal(assistantEdit: Assistant): void {
    this.as_user_id.setValue(assistantEdit.as_user_id);
    this._as_username.setValue(assistantEdit.as_username);
    this._as_fname.setValue(assistantEdit.as_fname);
    this._as_mname.setValue(assistantEdit.as_mname);
    this._as_lname.setValue(assistantEdit.as_lname);
    this._as_phone.setValue(assistantEdit.as_phone);
    this._as_email.setValue(assistantEdit.as_email);
    this._as_dr_id.setValue(assistantEdit.as_dr_id);

    this.updateForm.setValue({
      'as_user_id': this.as_user_id.value,
      'as_username': this._as_username.value,
      'as_fname': this._as_fname.value,
      'as_mname': this._as_mname.value,
      'as_lname': this._as_lname.value,
      'as_phone': this._as_phone.value,
      'as_email': this._as_email.value,
      'as_dr_id': this._as_dr_id.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);

  }

  // Method to Delete the Assistant
  onDelete(assistant: Assistant): void {
    this.assistantService.deleteAssistant(assistant.as_user_id).subscribe(result => {
      this.errorList = [];
      this.assistantService.clearCache();
      this.assistants$ = this.assistantService.getAll();
      this.assistants$.subscribe(newlist => {
        this.assistants = newlist;
        
        this.rerender();
      });
      console.log("Assistant Deleted");
      this.modalMessage = "Assistant Deleted";
      this.modalError = "Assistant Deleted";
      this.modalErr = this.modalService.show(this.errormodal)
    })
  }

  onSelect(assistant: Assistant): void {
    this.selectedAssistant = assistant;

    this.router.navigateByUrl("/assistants/" + assistant.as_user_id);
  }

  // Custom Validator

  MustMatch(as_passwordControl: AbstractControl): ValidatorFn {
    return (ConfirmPasswordControl: AbstractControl): { [key: string]: boolean } | null => {
      // return null if controls haven't initialised yet
      if (!as_passwordControl && !ConfirmPasswordControl) {
        return null;
      }

      // return null if another validator has already found an error on the matchingControl
      if (ConfirmPasswordControl.hasError && !as_passwordControl.hasError) {
        return null;
      }
      // set error on matchingControl if validation fails
      if (as_passwordControl.value !== ConfirmPasswordControl.value) {
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

    this.assistants$ = this.assistantService.getAll();

    this.assistants$.subscribe(result => {
      this.assistants = result;

      this.chRef.detectChanges();

      this.dtTrigger.next();
    });

    this.acct.currentUserRole.subscribe(result => { this.userRoleStatus = result });

    //List of Inurance Companies
    this.doctors$ = this.doctorService.getAll();

    this.doctors$.subscribe(result => {
      this.doctors = result;

    });

    this.errorList = [];

    // Modal Message
    this.modalMessage = "All Fields Are Mandatory";

    // Initializing Add assistant properties

    this.as_username = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.as_password = new FormControl('', [Validators.required, Validators.pattern(this.passRegex), Validators.maxLength(50), Validators.minLength(6)]);
    this.ConfirmPassword = new FormControl('', [Validators.required, this.MustMatch(this.as_password)]);
    this.as_email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(256)]);
    this.as_phone = new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex), Validators.maxLength(100)]);
    this.as_fname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.as_mname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.as_lname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this.as_dr_id = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
      {
        'as_username': this.as_username,
        'as_password': this.as_password,
        'ConfirmPassword': this.ConfirmPassword,
        'as_email': this.as_email,
        'as_phone': this.as_phone,
        'as_fname': this.as_fname,
        'as_mname': this.as_mname,
        'as_lname': this.as_lname,
        'as_dr_id': this.as_dr_id,
      });

    // Initializing Update Assistant properties
    this.as_user_id = new FormControl('', [Validators.required]);
    this._as_username = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._as_email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]);
    this._as_phone = new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex), Validators.maxLength(100)]);
    this._as_fname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this._as_mname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this._as_lname = new FormControl('', [Validators.required, Validators.pattern(this.nameRegex), Validators.maxLength(50)]);
    this._as_dr_id = new FormControl('', [Validators.required]);

    this.updateForm = this.fb.group(
      {
        'as_username': this._as_username,
        'as_email': this._as_email,
        'as_phone': this._as_phone,
        'as_fname': this._as_fname,
        'as_mname': this._as_mname,
        'as_lname': this._as_lname,
        'as_user_id': this.as_user_id,
        'as_dr_id': this._as_dr_id,
      });


  }

  ngOnDestroy() {
    // Do not forget to unsubscribe
    this.dtTrigger.unsubscribe();
  }
}
