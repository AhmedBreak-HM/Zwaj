import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-member-gallery',
  templateUrl: './member-gallery.component.html',
  styleUrls: ['./member-gallery.component.scss']
})
export class MemberGalleryComponent implements OnInit {

  @Input() userPhotos: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] ;
  constructor() { }

  ngOnInit() {

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.galleryImages = this.getPhotos();
  }


  getPhotos() {
    const imgUrl = []
    for (const photo of this.userPhotos.photos) {
      imgUrl.push(
        {
          small: photo.url,
          medium: photo.url,
          big: photo.url
        }
      );
    }
    return imgUrl;
  }
}
