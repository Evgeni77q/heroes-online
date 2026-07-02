import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  banUser(userId: string) {
    return { banned: userId };
  }

  giveResources(cityId: string, type: string, amount: number) {
    return {
      cityId,
      type,
      amount,
      status: 'GRANTED',
    };
  }

  forceEvent(event: string) {
    return {
      event,
      status: 'TRIGGERED',
    };
  }
}
