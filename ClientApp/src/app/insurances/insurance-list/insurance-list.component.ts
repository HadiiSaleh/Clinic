import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl, ValidatorFn} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { InsuranceCompany } from '../../interfaces/insurance-company';
import { InsuranceService } from '../../services/insurance.service';

@Component({
  selector: 'app-insurance-list',
  templateUrl: './insurance-list.component.html',
  styleUrls: ['./insurance-list.component.css']
})
export class InsuranceListComponent implements OnInit, OnDestroy {

  // For the FormControl - Adding Insurance
  insertForm: FormGroup;
  ins_username: FormControl;
  ins_password: FormControl;
  ConfirmPassword: FormControl;
  ins_email: FormControl;
  ins_phone: FormControl;
  ins_name: FormControl;
  ins_address: FormControl;
  ins_fax: FormControl;

  // Updating the Insurance
  updateForm: FormGroup;
  _ins_username: FormControl;
  _ins_email: FormControl;
  _ins_password: FormControl;
  _ConfirmPassword: FormControl;
  _ins_phone: FormControl;
  _ins_name: FormControl;
  _ins_address: FormControl;
  _ins_fax: FormControl;
  cid: FormControl;


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
  selectedInsurance: InsuranceCompany;
  companies$: Observable<InsuranceCompany[]>;
  companies: InsuranceCompany[] = [];
  userRoleStatus: string;
  errorList: string[];

  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  phoneRegex = "[+][0-9]{3} [0-9]{8}";
  nameRegex = "^[A-Za-z]+$";
  passRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9_]).*$";


  constructor(private insuranceService: InsuranceService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private acct: LoginService) { }

  /// Load Add New insurance companie Modal
  onAddCompany() {
    this.modalRef = this.modalService.show(this.modal);
  }

  // Method to Add new insurance companie
  onSubmit() {
    let newCompany = this.insertForm.value;

    this.insuranceService.insertCompany(newCompany).subscribe(
      result => {
        this.errorList = [];
        this.insuranceService.clearCache();
        this.companies$ = this.insuranceService.getAll();

        this.companies$.subscribe(newlist => {
          this.companies = newlist;
          this.modalRef.hide();
          this.insertForm.reset();
          this.rerender();

        });
        console.log("New Company added");
        this.modalMessage = "New Company added";
        this.modalError = "New Company added";
        this.modalErr = this.modalService.show(this.errormodal)
      },
      error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalError = "Add Company was Unsuccessful";
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

  // Update an Existing Comany
  onUpdate() {
    let editProduct = this.updateForm.value;
    this.insuranceService.updateCompany(editProduct.cid, editProduct).subscribe(
      result => {
        this.errorList = [];
        console.log('Company Updated');
        this.insuranceService.clearCache();
        this.companies$ = this.insuranceService.getAll();
        this.companies$.subscribe(updatedlist => {
          this.companies = updatedlist;

          this.modalRef.hide();
          this.rerender();
        });
        console.log("Company Edited");
        this.modalMessage = "Company Edited";
        this.modalError = "Company Edited";
        this.modalErr = this.modalService.show(this.errormodal)
      },
      error => {
        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalError = "Edit Company was Unsuccessful";
        this.modalErr = this.modalService.show(this.errormodal)

      });
  }

  // Load the update Modal

  onUpdateModal(companyEdit: InsuranceCompany): void {
    this.cid.setValue(companyEdit.cid);
    this._ins_username.setValue(companyEdit.ins_username);
    this._ins_name.setValue(companyEdit.ins_name);
    this._ins_phone.setValue(companyEdit.ins_phone);
    this._ins_email.setValue(companyEdit.ins_email);
    this._ins_fax.setValue(companyEdit.ins_fax);
    this._ins_address.setValue(companyEdit.ins_address);

    this.updateForm.setValue({
      'cid': this.cid.value,
      'ins_username': this._ins_username.value,
      'ins_name': this._ins_name.value,
      'ins_phone': this._ins_phone.value,
      'ins_email': this._ins_email.value,
      'ins_fax': this._ins_fax.value,
      'ins_address': this._ins_address.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);

  }

  // Method to Delete the Company
  onDelete(company: InsuranceCompany): void {
    this.insuranceService.deleteCompany(company.cid).subscribe(result => {
      this.errorList = [];
      this.insuranceService.clearCache();
      this.companies$ = this.insuranceService.getAll();
      this.companies$.subscribe(newlist => {
        this.companies = newlist;

        this.rerender();
      });
      console.log("Company Deleted");
      this.modalMessage = "Company Deleted";
      this.modalError = "Company Deleted";
      this.modalErr = this.modalService.show(this.errormodal)
    })
  }

  onSelect(company: InsuranceCompany): void {
    this.selectedInsurance = company;

    this.router.navigateByUrl("/insurances/" + company.cid);
  }

  // Custom Validator

  MustMatch(ins_passwordControl: AbstractControl): ValidatorFn {
    return (ConfirmPasswordControl: AbstractControl): { [key: string]: boolean } | null => {
      // return null if controls haven't initialised yet
      if (!ins_passwordControl && !ConfirmPasswordControl) {
        return null;
      }

      // return null if another validator has already found an error on the matchingControl
      if (ConfirmPasswordControl.hasError && !ins_passwordControl.hasError) {
        return null;
      }
      // set error on matchingControl if validation fails
      if (ins_passwordControl.value !== ConfirmPasswordControl.value) {
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

    this.companies$ = this.insuranceService.getAll();

    this.companies$.subscribe(result => {
      this.companies = result;

      this.chRef.detectChanges();

      this.dtTrigger.next();
    });

    this.acct.currentUserRole.subscribe(result => { this.userRoleStatus = result });

    this.errorList = [];

    // Modal Message
    this.modalMessage = "All Fields Are Mandatory";

    // Initializing Add company properties

    this.ins_username = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.ins_password = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(this.passRegex)]);
    this.ConfirmPassword = new FormControl('', [Validators.required, Validators.maxLength(100), this.MustMatch(this.ins_password)]);
    this.ins_name = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(this.nameRegex)]);
    this.ins_email = new FormControl('', [Validators.required, Validators.maxLength(256), Validators.email]);
    this.ins_phone = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(this.phoneRegex)]);
    this.ins_fax = new FormControl('', [Validators.maxLength(100), Validators.pattern(this.phoneRegex)]);
    this.ins_address = new FormControl('', [Validators.required, Validators.maxLength(100)]);

    this.insertForm = this.fb.group({
      'ins_username': this.ins_username,
      'ins_password': this.ins_password,
      'ConfirmPassword': this.ConfirmPassword,
      'ins_name': this.ins_name,
      'ins_email': this.ins_email,
      'ins_phone': this.ins_phone,
      'ins_fax': this.ins_fax,
      'ins_address': this.ins_address,

    });

    // Initializing Update Comapany properties
    this.cid = new FormControl('', [Validators.required]);
    this._ins_username = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._ins_name = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(this.nameRegex)]);
    this._ins_email = new FormControl('', [Validators.required, Validators.maxLength(256), Validators.email]);
    this._ins_phone = new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(this.phoneRegex)]);
    this._ins_fax = new FormControl('', [Validators.maxLength(100), Validators.pattern(this.phoneRegex)]);
    this._ins_address = new FormControl('', [Validators.maxLength(100)]);

    this.updateForm = this.fb.group(
      {
        'cid': this.cid,
        'ins_username': this._ins_username,
        'ins_name': this._ins_name,
        'ins_email': this._ins_email,
        'ins_phone': this._ins_phone,
        'ins_fax': this._ins_fax,
        'ins_address': this._ins_address,
      });


  }

  ngOnDestroy() {
    // Do not forget to unsubscribe
    this.dtTrigger.unsubscribe();
  }

}
