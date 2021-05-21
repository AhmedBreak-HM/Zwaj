import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale } from 'ngx-bootstrap/locale';
defineLocale('ar', arLocale);

import { listLocales } from 'ngx-bootstrap/chronos';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  @Output() cancelRegister = new EventEmitter();

  bsConfig: Partial<BsDatepickerConfig>;
  locale = 'ar';
  locales = listLocales();
  // reactiveForms
  registerForm: FormGroup;
  // = new FormGroup(
  //   {
  //     username: new FormControl('', Validators.required),
  //     password: new FormControl('',
  //       [
  //         Validators.required, Validators.minLength(4),
  //         Validators.maxLength(8)
  //       ]),
  //     confirmPassword: new FormControl('', Validators.required)
  //   }, this.passwordMatchValidator
  // );

  constructor(private authService: AuthService, private alert: AlertifyService,
    private fb: FormBuilder, private localeService: BsLocaleService,
    private router: Router) { }


  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        gender: ['رجل'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: ['',
          [
            Validators.required, Validators.minLength(4),
            Validators.maxLength(8)
          ]
        ],
        confirmPassword: ['', Validators.required]


      },
      {
        validator: this.passwordMatchValidator
      }
    );
    // ngx-bootstrap/datepicker
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-red',
      showWeekNumbers: false

    });
    this.localeService.use(this.locale);
  }

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        () => {
          this.alert.success('تم الاشتراك بنجاح');
          console.log('register is succes')
          this.cancelRegister.emit(false);
          this.model.username = this.username().value;
          this.model.password = this.password().value;
          console.log(this.model);

        },
        err => {
          this.alert.error('register is error' + err);
          console.log('register is error' + err)
        }, () => {
          this.authService.login(this.model).subscribe(() =>

            this.router.navigate(['/members'])

          );
        }
      );
    }
  }

  cancel() {
    console.log(' not now ');
    this.cancelRegister.emit(false);
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value ? null : { 'mismatch': true };
  }

  username() {
    return this.registerForm.get('username');
  }
  password() {
    return this.registerForm.get('password');
  }
  confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

}
