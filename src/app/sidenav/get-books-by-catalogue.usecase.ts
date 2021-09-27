import { Injectable } from '@angular/core';

import { CatalogueService } from '../service/catalogue.service';

@Injectable({
  providedIn: 'root'
})
export class GetBooksByCatalogueUseCase {
  constructor(private catalogueService: CatalogueService) { }

  getBooksByCatalogue(catalogueId: any) {
    return this.catalogueService.getBooksByCatalogue(catalogueId);
  }
}
