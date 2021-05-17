import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  @Output() cancelRegister = new EventEmitter();

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
    private fb: FormBuilder) { }

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
  }

  register() {
    console.log(this.registerForm.value);
    // this.authService.register(this.model).subscribe(
    //   () => {
    //     this.alert.success('تم الاشتراك بنجاح');
    //     console.log('register is succes')
    //     this.cancelRegister.emit(false);

    //   },
    //   err => {
    //     this.alert.error('register is error' + err);
    //     console.log('register is error' + err)
    //   }
    // );
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
