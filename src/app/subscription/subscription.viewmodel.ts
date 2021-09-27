import { CatalogueViewModel } from "../sidenav/catalogue.viewmodel";

export class SubscriptionViewModel {
    subscriptionId: string | null | undefined;
    userId: string | null | undefined;
    name: string | null | undefined;
    catalogueId: string | null | undefined;
    reference: string | null | undefined;
    createdAt: Date | undefined;
    isDeleted: boolean | undefined;
    catalogue: CatalogueViewModel | undefined;
}
