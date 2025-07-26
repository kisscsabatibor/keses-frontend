import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-details',
  imports: [MatTableModule, MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  timetableWithDates: any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.timetableWithDates = this.getTimetableWithDates();
  }

  get start(): string {
    return this.data.timetable[0]?.place || 'N/A';
  }

  get destination(): string {
    return this.data.timetable[this.data.timetable.length - 1]?.place || 'N/A';
  }

  getTimetableWithDates(): any[] {
    const today = new Date();
    let lastHour = 0;
    let currentDate = new Date(today);

    return this.data.timetable.map(
      (entry: {
        expectedArrival: { split: (arg0: string) => { (): any; new (): any; map: { (arg0: NumberConstructor): [any, any]; new (): any } } };
        expectedDeparture: { split: (arg0: string) => { (): any; new (): any; map: { (arg0: NumberConstructor): [any, any]; new (): any } } };
        realArrival: { split: (arg0: string) => { (): any; new (): any; map: { (arg0: NumberConstructor): [any, any]; new (): any } } };
        realDeparture: { split: (arg0: string) => { (): any; new (): any; map: { (arg0: NumberConstructor): [any, any]; new (): any } } };
      }) => {
        const [expArrH, expArrM] = entry.expectedArrival.split(':').map(Number);
        const [expDepH, expDepM] = entry.expectedDeparture.split(':').map(Number);
        const [realArrH, realArrM] = entry.realArrival.split(':').map(Number);
        const [realDepH, realDepM] = entry.realDeparture.split(':').map(Number);

        if (expArrH < lastHour) currentDate.setDate(currentDate.getDate() + 1);
        const expectedArrivalDate = new Date(currentDate);
        expectedArrivalDate.setHours(expArrH, expArrM, 0, 0);
        lastHour = expArrH;

        const expectedDepartureDate = new Date(expectedArrivalDate);
        if (expDepH < expArrH - 6) expectedDepartureDate.setDate(expectedDepartureDate.getDate() + 1);
        expectedDepartureDate.setHours(expDepH, expDepM, 0, 0);

        const realArrivalDate = new Date(expectedArrivalDate);
        if (realArrH < expArrH - 6) realArrivalDate.setDate(realArrivalDate.getDate() + 1);
        realArrivalDate.setHours(realArrH, realArrM, 0, 0);

        const realDepartureDate = new Date(expectedDepartureDate);
        if (realDepH < expDepH - 6) realDepartureDate.setDate(realDepartureDate.getDate() + 1);
        realDepartureDate.setHours(realDepH, realDepM, 0, 0);

        return {
          ...entry,
          expectedArrivalDate,
          expectedDepartureDate,
          realArrivalDate,
          realDepartureDate,
        };
      }
    );
  }

  isLateArrival(expectedDate: Date, realDate: Date): boolean {
    return realDate.getTime() > expectedDate.getTime();
  }

  isPastExpected(expectedDate: Date): boolean {
    return new Date().getTime() > expectedDate.getTime();
  }

  isLate(expected: Date, actual: Date): boolean {
    return actual.getTime() > expected.getTime();
  }

  isEarly(expected: Date, actual: Date, stationNum: any = -1): boolean {
    return actual.getTime() + 120 < expected.getTime() && stationNum !== 0;
  }
}
