import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrainMapComponent } from './train-map/train-map.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TrainMapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'keses-frontend';
}
