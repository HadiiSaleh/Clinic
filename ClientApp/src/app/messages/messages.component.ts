import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private modalService: BsModalService) { }

  // Properties
  insertForm: FormGroup;
  modalRef: BsModalRef;
  Name: FormControl;
  Email: FormControl;
  Subject: FormControl;
  Message: FormControl;

  errorList: string[];
  modalMessage: string;

  @ViewChild('template') modal: TemplateRef<any>;

  onSubmit() {

    let message = this.insertForm.value;

    this.messageService.send(message.Name, message.Email, message.Subject, message.Message).subscribe(result => {

        this.router.navigate(['/home']);
      }, error => {

        this.errorList = [];

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error)
        this.modalMessage = "Sending Message Was Unsuccessful";
        this.modalRef = this.modalService.show(this.modal)
      });
  }

  ngOnInit() {
    this.Name = new FormControl('', [Validators.required]);
    this.Email = new FormControl('', [Validators.required, Validators.email]);
    this.Subject = new FormControl('', [Validators.required]);
    this.Message = new FormControl('', [Validators.required, Validators.maxLength(500)]);
    
    this.errorList = [];


    this.insertForm = this.fb.group(
      {
        'Name': this.Name,
        'Email': this.Email,
        'Subject': this.Subject,
        'Message': this.Message,
      });

  }

}
