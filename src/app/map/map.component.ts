import { Component, inject, Input, NgZone, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import * as polyline from '@mapbox/polyline';
import { DataService } from '../services/data.service';
import { DetailsComponent } from '../details/details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnDestroy {
  private map!: L.Map;
  private dataService = inject(DataService);
  private ngZone = inject(NgZone);
  private dialog = inject(MatDialog);
  private routeLayer: L.Polyline | null = null;
  private refreshIntervalId: any;
  private dataMarkers: L.Layer[] = [];
  @Input() isTrainMap = true;

  ngOnInit(): void {
    this.initMap();
    this.fetchAndPlotData();

    this.refreshIntervalId = setInterval(() => {
      this.fetchAndPlotData();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
  }

  private fetchAndPlotData(): void {
    this.dataService.fetchData(this.isTrainMap).subscribe(data => {
      this.clearData();
      this.plotData(data);
    });
  }

  private clearData(): void {
    this.dataMarkers.forEach(marker => this.map.removeLayer(marker));
    this.dataMarkers = [];

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

  private plotData(points: any[]): void {
    points.forEach(point => {
      point.delay = Math.round(point.delay);
      let color = 'green';
      if (point.delay > 5 && point.delay < 15) {
        color = 'yellow';
      } else if (point.delay >= 15 && point.delay < 60) {
        color = 'orange';
      } else if (point.delay >= 60) {
        color = 'red';
      }

      const circle = L.circleMarker([point.lat, point.lon], {
        fillColor: color,
        fillOpacity: 1,
        radius: 8,
        stroke: true,
        color: 'black',
        weight: 2,
        pane: 'circlesPane',
      }).addTo(this.map);

      this.dataMarkers.push(circle);

      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <b>${point.trip.tripShortName}</b><br/>
        ${point.start}<br/>
        ${point.timetable[point.timetable.length - 1]?.place || 'N/A'}<br/>
        Késés: ${Math.round(point.delay)} perc<br/>
        Sebesség: ${Math.round(point.speed * 3.6)} km/h<br/>
        <button id="openDialogBtn" style="margin-top:5px;">Részletek</button>
      `;

      popupContent.querySelector('#openDialogBtn')!.addEventListener('click', () => {
        this.ngZone.run(() => {
          this.dialog.open(DetailsComponent, {
            data: point,
          });
        });
      });

      circle.bindPopup(popupContent);

      const latlngs = polyline.decode(point.route);
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
