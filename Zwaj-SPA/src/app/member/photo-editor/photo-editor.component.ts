import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/models/photo';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[]
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.baseUrl + 'users';
  userId: number;
  currentMain: Photo;

  @Output() sentUSerPhotoChange = new EventEmitter<Photo>();


  constructor(private authService: AuthService, private alert: AlertifyService,
    private userService: UserService) { }

  ngOnInit() {
    this.userId = this.authService.decodedToken.nameid;
    this.initializeUploader();

  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader(
      {
        url: this.baseUrl + '/' + this.userId + '/photos/CreatePhoto',
        authToken: 'Bearer ' + localStorage.getItem('token'),
        isHTML5: true,
        allowedFileType: ['image'],
        removeAfterUpload: true,
        autoUpload: false,
        maxFileSize: 10 * 1024 * 1024,

      }
    );
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, Response, status, headers) => {
      if (Response) {
        const res: Photo = JSON.parse(Response);
        const photo = {
          id: res.id,
          url: res.url,
          createdAt: res.createdAt,
          isMain: res.isMain,
          description: res.description
        };
        this.photos.push(photo);
      }
    }
  }

  setPhotoIsMain(photo: Photo) {
    this.userService.updateIsMainPhoto(this.userId, photo.id).subscribe(
      res => {
        this.currentMain = this.photos.filter(p => p.isMain === true)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
        this.alert.success('Photo is main don');
        this.sentUSerPhotoChange.emit(photo);
        // send new photo url
        this.authService.changeUserPhoto(photo.url);
        // modify user in localStorage
        this.authService.curentUser.photoURL = photo.url;
        localStorage.setItem('user', JSON.stringify(this.authService.curentUser));

      },
      (err) => this.alert.error(err));
  }
  deletePhoto(id: number) {
    this.alert.confirm('are you sure to delet this photo', () => {
      this.userService.deletePhoto(this.userId, id).subscribe(()=> {
        this.alert.success('Photo is deleted');

        // delete photo from photos arry
        const index = this.photos.findIndex(p => p.id === id);
        this.photos.splice(index, 1);

      }, err => {
        this.alert.success('Photo is deleted');

        // delete photo from photos arry
        const index = this.photos.findIndex(p => p.id === id);
        this.photos.splice(index, 1);
      });
    });
  }

}
