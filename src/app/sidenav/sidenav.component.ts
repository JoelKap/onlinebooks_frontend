import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { BookCatalogueViewModel } from './book-catalogue.viewmodel';
import { CatalogueViewModel } from './catalogue.viewmodel';
import { GetBooksByCatalogueUseCase } from './get-books-by-catalogue.usecase';
import { GetCataloguesUseCase } from './get-catalogues.usecase';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  books: BookCatalogueViewModel[] = [];
  catalogues: CatalogueViewModel[] = [];

  constructor(private catalogueUseCase: GetCataloguesUseCase,
    private getBooksByCatalogueUseCase: GetBooksByCatalogueUseCase,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadCatalogues();
  }

  getBooksByCatelogue(catalogue: CatalogueViewModel) {
    this.getBooksByCatalogueUseCase.getBooksByCatalogue(catalogue.catalogueId).subscribe((resp: BookCatalogueViewModel[]) => {
      if(resp.length) {
        this.books = [];
        this.books.push.apply(this.books, resp);
        this.catalogueUseCase.savebooksToStore(this.books);
        this.catalogueUseCase.saveCatalogueName(catalogue.name);
        this.router.navigateByUrl('/books-by-catalogue');
      } else {
        this.toastr.info('No books were found, Please contact our administrator');
      }
    })
  }

  private loadCatalogues() {
    this.catalogueUseCase.getCatalogues().subscribe((resp: CatalogueViewModel[]) => {
      if(resp.length) {
        this.catalogues.push.apply(this.catalogues, resp);
      } else {
        this.toastr.info('No catalogues were found, Please contact our administrator')
      }
    })
  }
}
