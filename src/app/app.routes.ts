import { Routes } from '@angular/router';
import { TrainViewerComponent } from './train-viewer/train-viewer.component';
import { BusViewerComponent } from './bus-viewer/bus-viewer.component';

export const routes: Routes = [
  {
    path: '',
    component: TrainViewerComponent,
  },
  {
    path: 'bus',
    component: BusViewerComponent,
  },
];
