import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';

interface ICalculateMortgageArgs {
  propertyPrice: number;
  interestRate: number;
  duration: number;
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
    propertyPrice: [null, Validators.required],
    interestRate: [null, Validators.required],
    duration: [null, Validators.required],
  });

  state = {
    downPayment: '-',
    monthlyPayment: '-',
    totalInterestPaid: '-',
    totalAmountPaid: '-',
  };

  constructor(private formBuilder: FormBuilder) {}

  calculateMortgage({
    propertyPrice,
    interestRate,
    duration,
  }: ICalculateMortgageArgs) {
    const totalPayments = duration * 12;
    const downPayment = (propertyPrice * 15) / 100;
    const loanAmount = propertyPrice - downPayment;
    const monthlyInterestRate = interestRate / (12 * 100);

    const monthlyPayment =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

    const totalPayment = monthlyPayment * totalPayments;
    const totalInterestPaid = totalPayment - loanAmount;

    return {
      downPayment: downPayment.toFixed(),
      monthlyPayment: monthlyPayment.toFixed(),
      totalInterestPaid: totalInterestPaid.toFixed(),
      totalAmountPaid: (totalPayment + downPayment).toFixed(),
    };
  }

  onSubmit() {
    this.state = this.calculateMortgage(
      this.mortgageForm.value as unknown as ICalculateMortgageArgs
    );
  }
}
