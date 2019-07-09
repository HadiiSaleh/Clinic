import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsuranceService } from '../../services/insurance.service';
import { InsuranceCompany } from '../../interfaces/insurance-company';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.css']
})
export class InsuranceDetailsComponent implements OnInit {

  @Input() company: InsuranceCompany;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private insuranceService: InsuranceService) { }

  ngOnInit() {
    //let id = + this.route.snapshot.params['id'];
    const cid: string = this.route.snapshot.params.id;

    this.insuranceService.getCompanyById(cid).subscribe(result => this.company = result);

  }

}
