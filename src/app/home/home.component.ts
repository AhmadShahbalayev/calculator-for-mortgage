import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';

interface ICalculateMortgageArgs {
  downPayment: number;
  propertyPrice: number;
  interestRate: number;
  duration: number;
}

interface IState {
  paymentSchedule: {
    month: number;
    monthlyPayment: string;
    principalPaid: string;
    interestPaid: string;
    remainingLoan: string;
  }[];
  totalPaidPrincipal: string;
  totalPaidInterest: string;
  totalPaidAmount: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PanelModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    TableModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  mortgageForm = this.formBuilder.group({
    downPayment: [null, Validators.required],
    propertyPrice: [null, Validators.required],
    interestRate: [null, Validators.required],
    duration: [null, Validators.required],
  });

  state: IState = {
    paymentSchedule: [],
    totalPaidPrincipal: '',
    totalPaidInterest: '',
    totalPaidAmount: '',
  };

  constructor(private formBuilder: FormBuilder) {}

  calculateMortgage({
    downPayment,
    propertyPrice,
    interestRate,
    duration,
  }: ICalculateMortgageArgs) {
    const totalPayments = duration * 12;
    const loanAmount = propertyPrice - downPayment;
    const monthlyInterestRate = interestRate / (12 * 100);
    const monthlyPayment =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

    let remainingLoan = loanAmount;
    const paymentSchedule = [];
    let totalPaidPrincipal = 0;
    let totalPaidInterest = 0;

    for (let i = 0; i < totalPayments; i++) {
      const interestPayment = remainingLoan * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingLoan -= principalPayment;
      totalPaidPrincipal += principalPayment;
      totalPaidInterest += interestPayment;

      paymentSchedule.push({
        month: i + 1,
        monthlyPayment: monthlyPayment.toFixed(),
        principalPaid: principalPayment.toFixed(),
        interestPaid: interestPayment.toFixed(),
        remainingLoan: remainingLoan.toFixed(),
      });
    }

    const totalPaidAmount = totalPaidPrincipal + totalPaidInterest;

    return {
      paymentSchedule,
      totalPaidPrincipal: totalPaidPrincipal.toFixed(),
      totalPaidInterest: totalPaidInterest.toFixed(),
      totalPaidAmount: totalPaidAmount.toFixed(),
    };
  }

  onSubmit() {
    this.state = this.calculateMortgage(
      this.mortgageForm.value as unknown as ICalculateMortgageArgs
    );
  }
}
