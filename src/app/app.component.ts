import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonToggleModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected currentMode: 'bus' | 'train' = 'train';
  private router = inject(Router);
  title = 'Trabus';

  onModeChange(event: any) {
    const selectedMode = event.value;
    this.currentMode = selectedMode;

    if (selectedMode === 'bus') {
      this.router.navigate(['/bus']);
    } else if (selectedMode === 'train') {
      this.router.navigate(['/']);
    }
  }
}
