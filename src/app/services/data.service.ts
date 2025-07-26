import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrlTrain = 'https://keses-backend.onrender.com/fetch-train-data';
  private apiUrlBus = 'https://keses-backend.onrender.com/fetch-bus-data';
  private cacheTrainKey = 'trainData';
  private cacheTrainTimeKey = 'trainDataTimestamp';
  private cacheBusKey = 'busData';
  private cacheBusTimeKey = 'busDataTimestamp';
  private cacheDurationMs = 30000;
  public trainsLoaded = false;
  public busesLoaded = false;

  constructor(private http: HttpClient) {}

  fetchData(train: boolean) {
    if (train) {
      return this.fetchTrainData();
    } else {
      return this.fetchBusData();
    }
  }

  private fetchTrainData(): Observable<any> {
    const cached = sessionStorage.getItem(this.cacheTrainKey);
    const cachedTime = sessionStorage.getItem(this.cacheTrainTimeKey);
    const now = Date.now();

    if (cached && cachedTime && now - parseInt(cachedTime, 10) < this.cacheDurationMs) {
      return of(JSON.parse(cached));
    } else {
      sessionStorage.removeItem(this.cacheTrainKey);
      sessionStorage.removeItem(this.cacheTrainTimeKey);
      this.trainsLoaded = false;
    }

    return this.http.get<any>(this.apiUrlTrain).pipe(
      tap(data => {
        sessionStorage.setItem(this.cacheTrainKey, JSON.stringify(data));
        sessionStorage.setItem(this.cacheTrainTimeKey, now.toString());
        this.trainsLoaded = true;
      })
    );
  }

  private fetchBusData(): Observable<any> {
    const cached = sessionStorage.getItem(this.cacheBusKey);
    const cachedTime = sessionStorage.getItem(this.cacheBusTimeKey);
    const now = Date.now();

    if (cached && cachedTime && now - parseInt(cachedTime, 10) < this.cacheDurationMs) {
      return of(JSON.parse(cached));
    } else {
      sessionStorage.removeItem(this.cacheBusKey);
      sessionStorage.removeItem(this.cacheBusTimeKey);
      this.busesLoaded = false;
    }

    return this.http.get<any>(this.apiUrlBus).pipe(
      tap(data => {
        sessionStorage.setItem(this.cacheBusKey, JSON.stringify(data));
        sessionStorage.setItem(this.cacheBusTimeKey, now.toString());
        this.busesLoaded = true;
      })
    );
  }
}
