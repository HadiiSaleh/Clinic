import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private modalService: BsModalService) { }

  // Properties
  insertForm: FormGroup;
  email: FormControl;
  modalRef: BsModalRef;

  errorList: string[];
  modalMessage: string;

  @ViewChild('template') modal: TemplateRef<any>;

  onSubmit() {

    let brain = this.insertForm.value;

    this.loginService.forgotPasswrod(brain.email).subscribe(result => {

      this.router.navigate(['/home']);
    }, error => {

      this.errorList = [];

      for (var i = 0; i < error.error.value.length; i++) {
        this.errorList.push(error.error.value[i]);
        //console.log(error.error.value[i]);
      }

      console.log(error)
      this.modalMessage = "Wrong Email";
      this.modalRef = this.modalService.show(this.modal)
    });
  }

  ngOnInit() {

    this.email = new FormControl('', [Validators.required, Validators.email]);
    
    this.errorList = [];


    this.insertForm = this.fb.group(
      {
        'email': this.email,
      });
  }

}
