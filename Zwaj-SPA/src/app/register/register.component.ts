import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  constructor(private authService: AuthService, private alert: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe(
      () => {
        this.alert.success('تم الاشتراك بنجاح');
        console.log('register is succes')
        this.cancelRegister.emit(false);

      },
      err => {
        this.alert.error('register is error' + err);
        console.log('register is error' + err)
      }
    );
  }
  cancel() {
    console.log(' not now ');
    this.cancelRegister.emit(false);
  }

}
