import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from 'src/app/interfaces/doctor';
import { DoctorService } from '../../services/doctor.service'

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnInit {

  @Input() doctor: Doctor;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService) { }

  ngOnInit() {
    //let id = + this.route.snapshot.params['id'];
    const dr_user_id: string = this.route.snapshot.params.id;

    this.doctorService.getDoctorById(dr_user_id).subscribe(result => this.doctor = result);
  }

}
