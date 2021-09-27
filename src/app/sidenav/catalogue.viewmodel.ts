import { BookViewModel } from "../home/book.viewmodel";

export class CatalogueViewModel {
    catalogueId: string | undefined;
    name: string | undefined;
    price: 0 | undefined;
    createdAt:  Date | undefined;
    isDeleted: boolean | undefined;
    books!: BookViewModel[];
}
