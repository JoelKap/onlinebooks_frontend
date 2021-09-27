import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { BookService } from '../service/book.service';
import { BookViewModel } from './book.viewmodel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: BookViewModel[] = [];
  p: number = 1;
  constructor(private bookService: BookService, 
    private toast: ToastrService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  private loadBooks() {
    this.bookService.getBooks().subscribe((resp: BookViewModel[]) => {
      if(resp.length) {
        this.books.push.apply(this.books, resp);
      } else {
        this.toast.info('No books were found, please contact our admin');
      }
    })
  }
}
