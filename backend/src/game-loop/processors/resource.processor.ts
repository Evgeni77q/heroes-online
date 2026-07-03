import { Injectable } from '@nestjs/common';
import { BalanceService } from '../../balance/balance.service';

@Injectable()
export class ResourceProcessor {
  constructor(private balance: BalanceService) {}

  async process() {
    const production = this.balance.getResourceProduction(1);

    console.log('[TICK] resource production:', production);
  }
}
