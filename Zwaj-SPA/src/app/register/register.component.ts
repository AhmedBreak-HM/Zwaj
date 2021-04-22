import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  model:any = {};
  @Output() cancelRegister = new EventEmitter();

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  register(){
    this.authService.register(this.model).subscribe(
      ()=> console.log('register is succes'),
      err => console.log('register is error' + err)
      );
    console.log(this.model);
  }
  cancel(){
    console.log(' not now ');
    this.cancelRegister.emit(false);
  }

}
