import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-train-viewer',
  imports: [MapComponent],
  templateUrl: './train-viewer.component.html',
  styleUrl: './train-viewer.component.scss',
})
export class TrainViewerComponent {}
