import { BookViewModel } from "../home/book.viewmodel";

export class BookCatalogueViewModel {
    bookCatalogueId: string | undefined;
    catalogueId: string | undefined;
    bookId: string | undefined;
    createdAt: string | undefined;
    isDeleted: string | undefined;
    book: BookViewModel | undefined;
}
