import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BookViewModel } from '../home/book.viewmodel';

import { CatalogueService } from '../service/catalogue.service';
import { BookCatalogueViewModel } from '../sidenav/book-catalogue.viewmodel';
import { GetCataloguesUseCase } from '../sidenav/get-catalogues.usecase';
import { SaveUserSubscriptionUseCase } from '../subscription/save-user-subscription.usecase';
import { SubscriptionViewModel } from '../subscription/subscription.viewmodel';

@Component({
  selector: 'app-books-by-catalogue',
  templateUrl: './books-by-catalogue.component.html',
  styleUrls: ['./books-by-catalogue.component.css']
})
export class BooksByCatalogueComponent implements OnInit {
  p: number = 1;
  private booksSubs: Subscription | undefined;
  private catalogSubs: Subscription | undefined;
  bookCatalogues: BookCatalogueViewModel[] = [];

  booksToSave: BookViewModel[] = [];
  price = 0;
  catalogueName: string | undefined;

  EMPTY_GUID = '00000000-0000-0000-0000-000000000000'
  constructor(private catalogueUseCase: GetCataloguesUseCase,
    private router: Router,
    private toastr: ToastrService,
    private subsUseCase: SaveUserSubscriptionUseCase) { }

  ngOnInit(): void {
    this.loadCatalogueBooks();
    this.booksSubs = this.catalogueUseCase
      .getBooksListener()
      .subscribe(catalogueBooks => {
        this.bookCatalogues = [];
        this.bookCatalogues.push.apply(this.bookCatalogues, catalogueBooks);
        this.calculateCataloguePrice();
      });

    this.catalogSubs = this.catalogueUseCase
      .getCatalogueNameListener()
      .subscribe(name => {
        this.catalogueName = name;
      })
  }

  subscribe() {
    if (!!localStorage.getItem('token')) {
      const userSubscription: SubscriptionViewModel = this.createUserSubscription()
      this.subsUseCase.saveSubscription(userSubscription).subscribe((resp) => {
        if (resp) {
          this.toastr.success('You have just purchased a new subscription');
          this.router.navigateByUrl('/user-subscriptions');
        } else {
          this.toastr.warning('Please note the selected catalogues was not added as part of your purchase, either it already exist or something must have gone wrong!! please navigate to subscription link to virify otherwise, contact the administrator')
        }
      })
      this.router.navigateByUrl('/user-subscriptions');
    } else {
      this.toastr.success("Please login in order to subscribe");
    }
  }



  private createUserSubscription(): SubscriptionViewModel {
    return {
      subscriptionId: this.EMPTY_GUID,
      catalogueId: this.bookCatalogues[0].catalogueId,
      userId: localStorage.getItem('userId'),
      reference: '',
      name: '',
      createdAt: new Date(),
      isDeleted: false,
      catalogue: {
        catalogueId: this.EMPTY_GUID,
        createdAt: new Date(),
        isDeleted: false,
        name: '',
        price: 0.0,
        books: this.addCatalogueBooks()
      }
    };
  }

  private addCatalogueBooks(): BookViewModel[] {
    this.booksToSave.length = 0;
      this.bookCatalogues.forEach((book) => {
          this.booksToSave.push({
            bookId: book.book?.bookId,
            name: book.book?.name,
            author: book.book?.author,
            price: book.book?.price,
            createdAt: book.book?.createdAt,
            isDeleted: book.book?.isDeleted
          })
      })
      return this.booksToSave;
  }

  private calculateCataloguePrice() {
    this.bookCatalogues.forEach((bookCat: BookCatalogueViewModel) => {
      const book = bookCat.book as any;
      if (book) {
        this.price += book.price;
      }
    });
  }

  private loadCatalogueBooks() {
    this.bookCatalogues = this.catalogueUseCase.getBooksFromStore();
    if (!this.bookCatalogues.length)
      return this.router.navigateByUrl('/home');

    this.calculateCataloguePrice();
    this.catalogueName = this.catalogueUseCase.getCatalogueName();

    return;
  }
}
