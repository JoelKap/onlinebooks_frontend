import { SubscriptionViewModel } from "./subscription.viewmodel";

export class UserViewModel {
    subscriptionId: string | undefined;
    userId: string | undefined;
    catalogId: string | undefined;
    reference: string | undefined;
    createdAt: string | undefined;
    isDeleted: string | undefined;
    subscriptions: SubscriptionViewModel[]| undefined;
}
