import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessagesService {
  constructor() {}

  getFormErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required, please write a value';
    } else if (control.hasError('min')) {
      const minError = control.errors.min;
      return `The minimum posible value is ${minError.min}`;
    } else if (control.hasError('max')) {
      const maxError = control.errors.max;
      return `The maximum posible value is ${maxError.max}`;
    } else if (control.hasError('email')) {
      return 'An valid email address is needed';
    } else if (control.hasError('minlength')) {
      const minLengthError = control.errors.minlength;
      return `You should write at least ${minLengthError.requiredLength} characters`;
    } else {
      return '';
    }
  }
}
