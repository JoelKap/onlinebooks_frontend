import { Injectable } from '@angular/core';

import { SubscriptionService } from '../service/subscription.service';
import { SubscriptionViewModel } from './subscription.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class SaveUserSubscriptionUseCase {
  constructor(private subscriptionService: SubscriptionService) { }

  saveSubscription(subscription: SubscriptionViewModel) {
    return this.subscriptionService.saveSubscription(subscription);
  }
}
