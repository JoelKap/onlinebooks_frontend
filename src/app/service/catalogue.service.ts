import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {

    constructor(private http: HttpClient) {
    }

    getCatalogues(): Observable<any> {
        return this.http.get(`${BACKEND_URL}/api/Catalogue/`);
    }

    getBooksByCatalogue(catalogueId: string): Observable<any> {
        return this.http.get(`${BACKEND_URL}/api/BookCatalogue/${catalogueId}/`);
    }

    getSubscriptionBooks(subscriptionId: string | null | undefined, userId: string | null | undefined): Observable<any> {
        return this.http.get(`${BACKEND_URL}/api/Book/${subscriptionId}/${userId}`);
    }

    unsubscribeUserBook(userId: string | null | undefined, subscriptionId: string | null | undefined, bookId: string | null | undefined): Observable<any> {
        return this.http.get(`${BACKEND_URL}/api/Unsubscribe/${userId}/${subscriptionId}/${bookId}`);
    }

    deleteSubscription(subscriptionId: string | null | undefined) {
        return this.http.delete(`${BACKEND_URL}/api/Subscription/${subscriptionId}/`);
    }
}