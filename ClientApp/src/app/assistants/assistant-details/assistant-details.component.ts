import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Assistant } from 'src/app/interfaces/assistant';
import { AssistantService } from 'src/app/services/assistant.service';

@Component({
  selector: 'app-assistant-details',
  templateUrl: './assistant-details.component.html',
  styleUrls: ['./assistant-details.component.css']
})
export class AssistantDetailsComponent implements OnInit {

  @Input() assistant: Assistant;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private assistantService: AssistantService) { }

  ngOnInit() {
    //let id = + this.route.snapshot.params['id'];
    const as_user_id: string = this.route.snapshot.params.id;

    this.assistantService.getAssistantById(as_user_id).subscribe(result => this.assistant = result);
  }

}
