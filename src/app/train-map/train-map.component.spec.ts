import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainMapComponent } from './train-map.component';

describe('TrainMapComponent', () => {
  let component: TrainMapComponent;
  let fixture: ComponentFixture<TrainMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
