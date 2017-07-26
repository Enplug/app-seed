import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('video') videoElement: ElementRef;

  constructor() {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }



  receiveMessage(event) {
    console.log('App received message', event, this.videoElement);
  }
}
