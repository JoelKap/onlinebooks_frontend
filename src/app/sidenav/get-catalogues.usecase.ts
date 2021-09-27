import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { CatalogueService } from '../service/catalogue.service';
import { BookCatalogueViewModel } from '../sidenav/book-catalogue.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class GetCataloguesUseCase {

  bookCatalogues: BookCatalogueViewModel[] = [];
  private booksListener = new Subject<BookCatalogueViewModel[]>();
  private catalogueNameListener = new Subject<string>();
  private name: string | undefined;
  constructor(private catalogueService: CatalogueService) { }


  saveCatalogueName(name: string | undefined) {
    this.name = '';
    this.name = name;
    this.catalogueNameListener.next(name);
    return this.name;
  }

  getCatalogueNameListener(): Observable<any> {
    return this.catalogueNameListener.asObservable();
  }

  savebooksToStore(bookCatalogues: BookCatalogueViewModel[]) {
    this.bookCatalogues = [];
    this.bookCatalogues.push.apply(this.bookCatalogues, bookCatalogues);
    this.booksListener.next(this.bookCatalogues);
    return this.bookCatalogues;
  }

  getBooksListener(): Observable<any> {
    return this.booksListener.asObservable();
  }

  getBooksFromStore() {
    return this.bookCatalogues;
  }

  getCatalogueName() {
    return this.name;
  }

  getCatalogues() {
    return this.catalogueService.getCatalogues();
  }

  getSubscriptionBooks(subscriptionId: string | null | undefined, userId: string | null | undefined) {
    return this.catalogueService.getSubscriptionBooks(subscriptionId, userId);
  }

  unsubscribeUserBook(userId: string | null, subscriptionId: string | null | undefined, bookId: string | undefined) {
    return this.catalogueService.unsubscribeUserBook(userId, subscriptionId, bookId);
  }

  deleteSubscription(subscriptionId: string | null | undefined) {
    return this.catalogueService.deleteSubscription(subscriptionId);
  }
}
