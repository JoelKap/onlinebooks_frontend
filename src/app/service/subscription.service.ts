import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { SubscriptionViewModel } from '../subscription/subscription.viewmodel';

const BACKEND_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {

   constructor(private http: HttpClient) {
    }

    getUserSubscriptions(userId: string): Observable<any> {
        return this.http.get(`${BACKEND_URL}/api/Subscription/${userId}/`);
    }

    saveSubscription(subscription: SubscriptionViewModel) {
        return this.http.post(`${BACKEND_URL}/api/Subscription/`, subscription);
    }
}