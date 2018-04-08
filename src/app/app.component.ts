import { Component } from '@angular/core';
import { GatewayModel } from '../gateway/gateway.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  // styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private model: GatewayModel) {
  }

  isReady(): boolean {
    return this.model.isReady();
  }
}
