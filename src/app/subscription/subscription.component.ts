import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BookViewModel } from '../home/book.viewmodel';

import { CatalogueViewModel } from '../sidenav/catalogue.viewmodel';
import { GetCataloguesUseCase } from '../sidenav/get-catalogues.usecase';
import { GetUserSubscriptionUseCase } from './get-user-subscription.usecase';
import { SubscriptionViewModel } from './subscription.viewmodel';
import { UserViewModel } from './user.viewmodel';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  p: number = 1;
  headerMenu: string = '';
  closeResult: string = '';
  books: BookViewModel[] = [];
  subscription!: SubscriptionViewModel;
  catalogues: CatalogueViewModel[] = [];
  user: UserViewModel = {
    subscriptionId: undefined,
    userId: undefined,
    catalogId: undefined,
    reference: undefined,
    createdAt: undefined,
    isDeleted: undefined,
    subscriptions: undefined
  };
  subscriptions: SubscriptionViewModel[] = [];
  constructor(private subsUseCase: GetUserSubscriptionUseCase,
    private toastr: ToastrService,
    private catalogueUseCase: GetCataloguesUseCase,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadUserSubscription();
  }

  viewSubscriptionBooks(subscription: SubscriptionViewModel, content: any) {
    this.headerMenu = 'Books subscribed to' + ' ' + subscription.name;
    this.subscription = subscription;
    this.getSubscriptionBooks(subscription);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', modalDialogClass: 'modal-lg' }).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteSubscription(subscription: SubscriptionViewModel) {
    this.catalogueUseCase.deleteSubscription(subscription.subscriptionId).subscribe((resp) => {
      if (resp) {
        const idx = this.subscriptions.findIndex(x => x.subscriptionId === subscription.subscriptionId);
        if (idx > -1) {
          this.subscriptions.splice(1, idx);
        }
        this.toastr.success('removed successfully removed');
      } else {
        this.toastr.error('we were not able to remove this subscription, please contact the admin');
      }
    })
  }

  Unsubscribe(book: BookViewModel) {
    this.catalogueUseCase.unsubscribeUserBook(localStorage.getItem('userId'), this.subscription.subscriptionId, book.bookId).subscribe((resp: BookViewModel[]) => {
      if (resp) {
        const idx = this.books.findIndex(x => x.bookId === book.bookId);
        if (idx > 0) {
          this.books.splice(1, idx);
        }
        this.toastr.success('book successfully removed');
      } else {
        this.toastr.error('we were not able to unbscribe you fromt this book, please contact the admin');
      }
    })
  }

  private getSubscriptionBooks(subscription: SubscriptionViewModel) {
    this.catalogueUseCase.getSubscriptionBooks(subscription.subscriptionId, subscription.userId).subscribe((resp: BookViewModel[]) => {
      this.books.length = 0;
      if (resp.length) {
        this.books.push.apply(this.books, resp);
      } else {
        this.toastr.info('No books found for this subscription');
      }
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private loadUserSubscription() {
    const userId = localStorage.getItem('userId');
    if (userId)
      this.subsUseCase.getUserSubscriptions(userId).subscribe((resp: UserViewModel) => {
        if (resp.subscriptions?.length) {
          this.loadCatalogues();
          this.subscriptions.length = 0;
          this.subscriptions.push.apply(this.subscriptions, resp.subscriptions);
        } else {
          this.toastr.info('No subscription(s) found for this user!');
        }
      })
  }

  private loadCatalogues() {
    this.catalogueUseCase.getCatalogues().subscribe((resp: CatalogueViewModel[]) => {
      if (resp.length) {
        this.catalogues = [];
        this.catalogues.push.apply(this.catalogues, resp);
        const subscriptions: any = this.subscriptions;
        for (let index = 0; index < subscriptions.length; index++) {
          const subs = subscriptions[index];
          const catalogue = this.catalogues.find(x => x.catalogueId === subs.catalogueId);
          if (catalogue) {
            subs.name = catalogue.name;
          }
        }
      } else {
        this.toastr.info('No Catalogues founds');
      }
    })
  }
}
