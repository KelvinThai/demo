import { BigNumber, ethers } from "ethers";
import { getRPC } from "../utils";
import { BaseInterface } from "./interfaces";
import { getLendingAbi } from "./utils/getAbis";
import { getLendingAddress } from "./utils/getAddress";

export const LENDING_PACKAGE = [200, 500, 1000, 3000, 5000, 10000, 25000]
export const LENDING_DAYS = [30, 90, 180, 365]

export interface ILenderInfo {
  amount : number;
  releaseDate: number;
  isRelease: boolean;
  rewardDebt: number;
  termOption: number;
  package: number;
}

export interface ILendInfo {
  totalAmount: number;
  totalLender: number;
}


export default class LendingContract extends BaseInterface {
  constructor(provider?: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(getRPC());
    super(provider ?? rpcProvider, getLendingAddress(), getLendingAbi())
    if (!provider) {
      this._contract = new ethers.Contract(this._contractAddress, this._abis, rpcProvider);
    }
  }
  
  private getPackageIndex = (amount: number) => {
    return LENDING_PACKAGE.findIndex(p => p === amount);
  }

  private getDaysIndex = (days: number) => LENDING_DAYS.findIndex(p => p === days);

  private validateIndex = (pkIndex: number, dayIndex: number) => {
    if (pkIndex < 0 || dayIndex < 0) throw new Error('PACKAGE INVALID.');
  }

  private getTotalLender = async() => {
    const tx: BigNumber = await this._contract.totalLender();
    return this._toNumber(tx);
  }

  private getTotalLentAmount = async() => {
    const tx: BigNumber = await this._contract.totalLentAmount();
    return this._toNumber(tx);
  }

  getLendInfo = async(): Promise<ILendInfo> => {
    const response = await Promise.all([this.getTotalLender(), this.getTotalLentAmount()]);
    return {totalLender: response[0], totalAmount:  response[1]}
  }

  getTokenAmountOuts = async (amount: number , days: number) => {
    const packageIndex = this.getPackageIndex(amount);
    const daysIndex = this.getDaysIndex(days);
    this.validateIndex(packageIndex, daysIndex);
    const tx = await this._contract.tokenAmountOuts(daysIndex, packageIndex);
    return this._toNumber(tx);
  }

  getLenderInfos = async(address: string): Promise<ILenderInfo[]> => {
   const infos = await this._contract["getLenderInfo(address)"](address);
   return infos.map((inf:any) => {
    return {
        rewardDebt: this._toNumber(inf.rewardDebt),
        amount: this._toNumber(inf.amount),
        package: this._toNumber(inf.package),
        termOption: this._toNumber(inf.termOption),
        isRelease: inf.isRelease,
        releaseDate: this._toNumber(inf.releaseDate)
      }
   })
  }

  lendToken = async (packageAmount: number, days: number) => {
    const packageIndex = this.getPackageIndex(packageAmount);
    const daysIndex = this.getDaysIndex(days); 
    this.validateIndex(packageIndex, daysIndex); 
    const tx = await this._contract.lend(packageAmount, days, this._option);
    return this._handleTransactionResponse(tx);
  }

  unLendToken = async(packageIndex: number) => {
    const tx = await this._contract.unLend(packageIndex);
    return this._handleTransactionResponse(tx);
  }
}