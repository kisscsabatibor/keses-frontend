import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-bus-viewer',
  imports: [MapComponent],
  templateUrl: './bus-viewer.component.html',
  styleUrl: './bus-viewer.component.scss',
})
export class BusViewerComponent {}
