import { observable, action } from 'mobx';

export class POSStore {
  @observable public rewardsDistributed: number = 0;
  @observable public topGuardians: string[] = [];

  public async init(): Promise<void> {
    await this.loadStore();
  }

  @action private async loadStore(): Promise<void> {
    this.rewardsDistributed = 68_789;
    this.topGuardians.push('MR.SHOWOFFTOKEN');
    this.topGuardians.push('SLOWMOSHE');
    this.topGuardians.push('DONTTELLMYMAMA');
  }
}