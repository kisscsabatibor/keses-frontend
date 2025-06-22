import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private apiUrl = 'http://localhost:3000/fetch-data';
  private cacheKey = 'trainData';
  private cacheTimeKey = 'trainDataTimestamp';
  private cacheDurationMs = 20 * 1000;

  constructor(private http: HttpClient) {}

  fetchData(): Observable<any> {
    const cached = sessionStorage.getItem(this.cacheKey);
    const cachedTime = sessionStorage.getItem(this.cacheTimeKey);
    const now = Date.now();

    if (cached && cachedTime && now - parseInt(cachedTime, 10) < this.cacheDurationMs) {
      return of(JSON.parse(cached));
    }

    return this.http.get<any>(this.apiUrl).pipe(
      tap(data => {
        sessionStorage.setItem(this.cacheKey, JSON.stringify(data));
        sessionStorage.setItem(this.cacheTimeKey, now.toString());
      })
    );
  }

  clearCache() {
    sessionStorage.removeItem(this.cacheKey);
    sessionStorage.removeItem(this.cacheTimeKey);
  }
}
