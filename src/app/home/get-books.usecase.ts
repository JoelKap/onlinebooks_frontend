import { Injectable } from '@angular/core';

import { BookService } from '../service/book.service';

@Injectable({
  providedIn: 'root'
})
export class GetBooksUseCase {
  userPaymentProcess =  undefined;

  constructor(private bookService: BookService) { }

  getBooks() {
    return this.bookService.getBooks();
  }
}
