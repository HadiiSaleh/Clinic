import { Component, TemplateRef, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Message } from 'src/app/interfaces/message';
import { MessageService } from 'src/app/services/message.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css']
})
export class MessagesListComponent implements OnInit {

  // Error Modal
  @ViewChild('errortemplate') errormodal: TemplateRef<any>;

  // Modal properties
  modalError: string;
  modalErr: BsModalRef;
  messages$: Observable<Message[]>;
  messages: Message[] = [];
  userRoleStatus: string;
  errorList: string[];

  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(private messageService: MessageService,
    private modalService: BsModalService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private acct: LoginService) { }

  // We will use this method to destroy old table and re-render new table

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }

  // Method to Delete the Company
  onDelete(message: Message): void {
    this.messageService.deleteMessage(message.m_id).subscribe(result => {
      this.errorList = [];
      this.messageService.clearCache();
      this.messages$ = this.messageService.getAll();
      this.messages$.subscribe(newlist => {
        this.messages = newlist;

        this.rerender();
      });
      console.log("Message Deleted");
      this.modalError = "Message Deleted";
      this.modalErr = this.modalService.show(this.errormodal)
    })
  }

  ngOnInit() {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 9,
        autoWidth: true,
        order: [[0, 'desc']]
      };

    this.messages$ = this.messageService.getAll();

      this.messages$.subscribe(result => {
        this.messages = result;

        this.chRef.detectChanges();

        this.dtTrigger.next();
      });

      this.acct.currentUserRole.subscribe(result => { this.userRoleStatus = result });

      this.errorList = [];

  }

}
