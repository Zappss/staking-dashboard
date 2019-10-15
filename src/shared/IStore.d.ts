export interface IPOSStoreState {
  blockHeight: number;
  rewardsDistributed: number;
  nextVotingTime: number;
  topGuardians: string[];
}

export interface ISocialStoreState {
  latestTweet: string;
  latestCommit: string;
  recentUpdate: string;
}

export interface ITokenStoreState {
  orbsInCirculation: number;
  tokenPrice: number;
  token24HVolume: number;
  totalHolders: number;
}

export interface IPOIStoreState {
  pointsOfInterest: any[];
}

export interface IStoreInitialData {
  posStoreState: IPOSStoreState;
  socialStoreState: ISocialStoreState;
  tokenStoreState: ITokenStoreState;
  poiStoreState: IPOIStoreState;
}
