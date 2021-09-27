import { Injectable } from '@angular/core';

import { SubscriptionService } from '../service/subscription.service';

@Injectable({
  providedIn: 'root'
})
export class GetUserSubscriptionUseCase {
  constructor(private subsService: SubscriptionService) { }

  getUserSubscriptions(userId: any) {
    return this.subsService.getUserSubscriptions(userId);
  }
}
