import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private apiUrl = 'https://keses-backend.onrender.com/fetch-data';
  private http = inject(HttpClient);

  fetchData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
