import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { RouteData } from 'src/app/models/routedata.model';
import { AlertService } from 'src/app/services/alert.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import { environment } from 'src/environments/environment';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

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
    this.getSymbols()

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
  this.chartOptionsFunction()
   this.data1 = this.routedata.ChartData[0].data
  this.data2 = this.routedata.ChartData[1].data

  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
    this.chartOptionsFunction()
  }
  getSymbols(){
 
    this.exchangeService.getSymbols()
    .subscribe(
      (res) => {
        const {symbols} =res
        this.Symbols = symbols
       } );
   
    
  }
  chartOptionsFunction(){
    this.data1 = this.routedata.ChartData[0]?.data
    this.data2 = this.routedata.ChartData[1]?.data
    this.chartOptions = {
      series: [
        {
          name: this.routedata.ChartData[0].name,
          data:this.data1 ,
        },
        {
          name: this.routedata.ChartData[1].name,
  
          data: this.data2,
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Historical data for selected currencies",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f1", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.2
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep", 
          "Oct",
          "Nov",
          "Dec"
          
        ]
      }
    };
  }
  get f() { return this.form.controls; }
  onSubmit() {
    this.exchangeService.ConvertSymbols(this.form.value)
    .subscribe(

    {
      next:(res)=>{
        this.loading = false;
          this.result = res
          this.getChartData()

      },
      error: (e)=>{
        this.alertService.error(e.message)
      }
    }
    )
   
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();


    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    // this.updateUser()
   
}
getChartData() {
  let newArray: any[] = [
    {
      name: '',
      data: ([] = []),
    },
    {
      name: '',
      data: ([] = []),
    },
  ];
  let from = this.form.value.from;
  let to = this.form.value.to;
  const datas = this.dates.map((t) =>
    this.http
      .get<any>(
        `${environment.apiUrl}/timeseries?start_date=${t}&end_date=${t}&symbols=${from},${to}`
      )
      .pipe(
        map((t) => {
          console.log('got here');
          let rates = t.rates;
          console.log(t, 'rate here');
          for (let dates in rates) {
            if (rates.hasOwnProperty(dates)) {
              let currencyValue = rates[dates];
              let currency = Object.keys(currencyValue);
              newArray[0].name = currency[0];
              newArray[1].name = currency[1];
              for (let currencySymbol in currencyValue) {
                let index = newArray.findIndex(
                  (p) => p.name == currencySymbol
                );
                newArray[index].data.push(currencyValue[currencySymbol]);
              }
            }
          }
        })
      )
  );

  forkJoin(datas)
    .pipe(catchError((err) => of(err)))
    .subscribe((res) => {
      let innere = res;
    });
  console.log(newArray, 'uuu');
  this.int2 = newArray;
  this.data1 = newArray[0]?.data
  this.data2 = newArray[1]?.data
  this.chartOptionsFunction()
}
initChart(){
  
}
goHome(){
this.router.navigateByUrl('exchange/home')

}

}
