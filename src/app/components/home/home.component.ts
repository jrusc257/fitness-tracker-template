import { Component, OnInit } from '@angular/core';
import { GoogleFitnessService } from 'src/app/services/google-fitness.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  steps: number = 0;

  constructor(private fitnessService: GoogleFitnessService) {}

  ngOnInit(): void {
    this.fitnessService.signIn().then(() => {
      console.log('Signed in to Google');
    }).catch((error) => {
      console.error('Sign-in error', error);
    });
  }

  getSteps(): void {
    this.fitnessService.getStepCounts().subscribe({
      next: (stepCount) => this.steps = stepCount,
      error: (error) => console.error('Error fetching steps', error)
    });
  }

}
