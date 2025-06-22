import { Component, inject, NgZone, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import * as polyline from '@mapbox/polyline';
import { TrainService } from '../train.service';
import { TrainDetailsComponent } from '../train-details/train-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-train-map',
  templateUrl: './train-map.component.html',
  styleUrl: './train-map.component.scss',
})
export class TrainMapComponent implements OnDestroy {
  private map!: L.Map;
  private trainService = inject(TrainService);
  private ngZone = inject(NgZone);
  private dialog = inject(MatDialog);
  private routeLayer: L.Polyline | null = null;
  private refreshIntervalId: any;
  private trainMarkers: L.Layer[] = [];

  ngOnInit(): void {
    this.initMap();
    this.fetchAndPlotTrains();

    this.refreshIntervalId = setInterval(() => {
      this.fetchAndPlotTrains();
    }, 25000);
  }

  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
  }

  private fetchAndPlotTrains(): void {
    this.trainService.fetchData().subscribe(data => {
      this.clearTrains();
      console.log(data);
      this.plotTrains(data);
    });
  }

  private clearTrains(): void {
    this.trainMarkers.forEach(marker => this.map.removeLayer(marker));
    this.trainMarkers = [];

    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([47.1625, 19.5033], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.createPane('circlesPane');
    this.map.getPane('circlesPane')!.style.zIndex = '650';
  }

  private plotTrains(trains: any[]): void {
    trains.forEach(train => {
      let color = 'green';
      if (train.delay > 5 && train.delay < 15) {
        color = 'yellow';
      } else if (train.delay >= 15 && train.delay < 60) {
        color = 'orange';
      } else if (train.delay >= 60) {
        color = 'red';
      }

      const circle = L.circleMarker([train.lat, train.lon], {
        fillColor: color,
        fillOpacity: 1,
        radius: 8,
        stroke: true,
        color: 'black',
        weight: 2,
        pane: 'circlesPane',
      }).addTo(this.map);

      this.trainMarkers.push(circle);

      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <b>${train.trip.tripShortName}</b><br/>
        ${train.start}<br/>
        ${train.trip.tripHeadsign}<br/>
        Késés: ${train.delay} perc<br/>
        <button id="openDialogBtn" style="margin-top:5px;">Részletek</button>
      `;

      popupContent.querySelector('#openDialogBtn')!.addEventListener('click', () => {
        this.ngZone.run(() => {
          this.dialog.open(TrainDetailsComponent, {
            data: train,
          });
        });
      });

      circle.bindPopup(popupContent);

      const latlngs = polyline.decode(train.route);
      const polylineLayer = L.polyline(latlngs, {
        color: 'red',
        weight: 4,
      });

      circle.on('click', () => {
        if (this.routeLayer) {
          this.map.removeLayer(this.routeLayer);
        }
        this.routeLayer = polylineLayer.addTo(this.map);
      });
    });
  }
}
