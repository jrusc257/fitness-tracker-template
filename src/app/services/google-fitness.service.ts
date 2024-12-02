import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { gapi } from 'gapi-script';

@Injectable({
  providedIn: 'root'
})
export class GoogleFitnessService {private CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
  private API_KEY = 'YOUR_API_KEY';
  private SCOPES = 'https://www.googleapis.com/auth/fitness.activity.read';
  private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest'];


  constructor() {
    gapi.load('client', this.initClient.bind(this));
  }

  private initClient(): void {
    gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES
    }).then(() => {
      console.log('Google API Client Initialized');
    }, (error: any) => {
      console.error('Error initializing Google API Client', error);
    });
  }

  signIn(): Promise<void> {
    return gapi.auth2.getAuthInstance().signIn();
  }

  getStepCounts(): Observable<number> {
    return new Observable((observer) => {
      gapi.client.fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: {
          aggregateBy: [{
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
          }],
          bucketByTime: { durationMillis: 86400000 }, // Daily step counts
          startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
          endTimeMillis: Date.now()
        }
      }).then((response: any) => {
        const stepCount = response.result.bucket.reduce((total: number, bucket: any) => {
          return total + bucket.dataset[0].point.reduce((sum: number, point: any) => {
            return sum + (point.value[0].intVal || 0);
          }, 0);
        }, 0);

        observer.next(stepCount);
        observer.complete();
      }).catch((error: any) => {
        console.error('Error fetching step counts', error);
        observer.error(error);
      });
    });
  }
}
