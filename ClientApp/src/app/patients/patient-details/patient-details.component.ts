import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/interfaces/patient';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {

  @Input() patient: Patient;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService) { }

  ngOnInit() {
    //let id = + this.route.snapshot.params['id'];
    const pat_user_id: string = this.route.snapshot.params.id;

    this.patientService.getPatientById(pat_user_id).subscribe(result => this.patient = result);
  }

}
