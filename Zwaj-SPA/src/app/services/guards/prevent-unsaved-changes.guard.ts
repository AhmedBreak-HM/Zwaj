import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from 'src/app/member/member-edit/member-edit.component';
import { AlertifyService, ConfirmResult } from '../alertify.service';


@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {
  x = false;
  constructor(private alertify: AlertifyService) { }

  async canDeactivate(component: MemberEditComponent) {

    if (component.editForm.dirty) {

      const confirm = await this.alertify.promisifyConfirm('إنتـبــه', 'تم تعديل البيانات الخاصة بك هل تود الإستمرار بدون حفظ البيانات');
      if (confirm == ConfirmResult.Ok) {
        this.x = true
      } else {
        this.x = false;
      }
      // return true;
      // return this.alertify.confirm('IKNDKGNK', () => {
      //   return true;
      // })
    }
    return true;

    // return false;
  }
  // OK(): boolean {
  //   return true;
  // }

  // checkGuard(){
  //   var x=of(false);
  //   var y =false;
  //   var m =false;

  //  this.alertify.confirm('تم تعديل البيانات الخاصة بك هل تود الإستمرار بدون حفظ البيانات',
  //   function(){x.subscribe(data=>y=!data);x=of(y);x.subscribe(t=>m=t)})
  //   console.log(m);
  //  return x;


  // }



}
