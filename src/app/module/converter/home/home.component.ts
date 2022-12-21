import { HttpClient } from '@angular/common/http';

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Convert } from 'src/app/models/convert.model';
import { AlertService } from 'src/app/services/alert.service';
import { ExchangeService } from 'src/app/services/exchange.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Input() public data: any;
  form!: FormGroup;
  result: Convert = {} as Convert;
  rates = {};
  loading = true;
  submitted = false;
  Symbols: any = {};
  Object = Object;
  default: string = 'UK';
  viewValues: any;
  constructor(  private fb: FormBuilder,
    private exchangeService: ExchangeService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private alertService: AlertService
    ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      amount: [1, [Validators.required, Validators.pattern('^[0-9]*$')]],
      from: ['EUR', Validators.required],
      to: ['USD', Validators.required],
    });

  }

get f() {
  return this.form.controls;
}
  
  getSymbols(){
    this.exchangeService.getSymbols().subscribe({
      next: (res) => {
        const { symbols } = res;
        this.Symbols = symbols;
      },
      error: (e) => {
        this.alertService.error(e.message);
      },
    });
  }

}
