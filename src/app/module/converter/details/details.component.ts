import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteData } from 'src/app/models/routedata.model';
import { AlertService } from 'src/app/services/alert.service';
import { ExchangeService } from 'src/app/services/exchange.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @Input() public data:any;
  form!: FormGroup;
  result!:any
  loading = true;
  submitted = false;
  routedata:RouteData = {} as RouteData
  Symbols!:any;
  Object = Object
  default: string = 'UK';
  from!:string
  to!:string
  data1!:any
  data2!: any
  int2!: any;
  dates: any[] = [
    '2022-01-31',
    '2022-02-28',
    // "2022-03-31",
    // "2022-04-30",
    // "2022-05-31","2022-06-30","2022-07-31","2022-08-31","2022-09-30","2022-01-31","2022-01-31","2022-01-31"
  ];

  constructor( private http: HttpClient, private fb:FormBuilder,private exchangeService:ExchangeService, private router:Router,private route:ActivatedRoute, private alertService : AlertService) { }

  ngOnInit(): void {
   

    this.routedata = history.state;
    console.log('route data', this.data);
   
    this.form = this.fb.group({
      amount: [this.routedata.form?.amount, [Validators.required,Validators.pattern("^[0-9]*$")]],
      from: ['${this.routedata.form?.from}',Validators.required],
      to: ['${this.routedata.form?.to}', Validators.required],

     
  });
  this.form.controls['from'].setValue(this.routedata.form?.from, {onlySelf: true});
  this.form.controls['to'].setValue(this.routedata.form?.to, {onlySelf: true});
  this.result = this.routedata.result
  
  this.from = this.routedata.ChartData[0].name
  this.from = this.routedata.ChartData[1].name
  
  

  
  this.loading =false;
 
   this.data1 = this.routedata.ChartData[0].data
  this.data2 = this.routedata.ChartData[1].data

  }

}
