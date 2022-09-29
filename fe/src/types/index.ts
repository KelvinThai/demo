export enum CHAIN_ID {
  TESTNET = 97,
  MAINNET = 56,
}


export enum TOKEN {
  IPT = 'IPT',
  POINT = 'POINT',
  BNB = 'BNB',
  USDT = 'USDT'
}

export type Vault = {
  token: string;
  value: number;
}

export interface IVaultModel {
  from: Vault;
  to: Vault;
}

export interface IWalletInfo {
  iptBalance: number;
  bnbBalance: number;
  address: string;
  bnbRate: number;
  usdtRate: number;
}


export interface IPackage {
  key: string;
  name: string;
  amount: number;
  icon: string;
  bg: string; 
  token : TOKEN;
}

export interface IStakerInfo {
  index: number;
  amount: number;
  releaseDate: number;
  isRelease: boolean;
  rewardDebt: number;
  termOption: "14" | "30";
  days: string;
  isLock: boolean;
}

export interface IAttribute {
  trait_type: string;
  value: string | number;
}

export interface INftItem {
  id: number;
  name?: string;
  description?: string;
  image: string;
  attributes?: IAttribute[];
  //Listing
  price?: number;
  author?: string;  
}

export enum Clarity {
  "A",
  "B",
  "C",
  "D",
  "E",
  "S",
  "SS",
  "SSS",
}
export type ActionType = "LIST" | "UNLIST" | "TRANSFER" | "AUCTION";

export interface IAuctionInfo extends  INftItem {
  auctionId: number;
  auctioneer: string;
  tokenId: number;
  initialPrice: number;
  previousBidder: string;
  lastBid: number;
  lastBidder: string;
  startTime: number;
  endTime: number;
  completed: boolean;
  active: boolean;
}
