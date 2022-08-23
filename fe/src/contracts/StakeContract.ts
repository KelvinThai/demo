import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber, ethers } from "ethers";
import { IStakerInfo } from "../types";
import { getDays, getDaysFromCurrent, getRPC, isAfter, parseBalance } from "../utils";
import { BaseInterface } from "./interfaces";
import { getStakingAbi } from "./utils/getAbis";
import { getStakingAddress } from "./utils/getAddress";


export interface IStakeInfo {
  totalStaker: number;
  twoWeekPoolRemain: number;
  oneMonthPoolRemain: number;
  totalStakedAmount: number;
  stakedPoolTwoWeek: number;
  stakedPoolOneMonth: number;
  remainValueTwoWeek: number;
  remainValueOneMonth: number;
}

export default class StakeContract extends BaseInterface {
  constructor(provider?: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(getRPC());
    super(provider ?? rpcProvider, getStakingAddress(), getStakingAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  private twoWeekPoolRemain = async () => {
    const rs: BigNumber = await this._contract.twoWeekPoolRemain();
    return this._toNumber(rs);
  };

  private oneMonthPoolRemain = async () => {
    const rs: BigNumber = await this._contract.oneMonthPoolRemain();
    return this._toNumber(rs);
  };

  private totalStaker = async () => {
    const rs: BigNumber = await this._contract.totalStaker();
    return this._toNumber(rs);
  };

  private totalStakedAmount = async () => {
    const rs: BigNumber = await this._contract.totalStakedAmount();
    return this._toNumber(rs)
  };

  private stakedPool = async (type: "TWO_WEEK" | "ONE_MONTH") => {
    const rs: BigNumber = await this._contract.stakedPool(type === 'TWO_WEEK' ? 0 : 1);
    return this._toNumber(rs);
  };

  private getRemainValue = async (type: "TWO_WEEK" | "ONE_MONTH"): Promise<number> => {
    const rs: BigNumber = type === "TWO_WEEK"
                        ? await this._contract.twoWeekPoolRemain()
                        : await this._contract.oneMonthPoolRemain();
    return this._toNumber(rs);
  };

  getStakeInfo = async(): Promise<IStakeInfo> => {
    const req = await Promise.all([
      this.totalStaker(),
      this.twoWeekPoolRemain(),
      this.oneMonthPoolRemain(),
      this.totalStakedAmount(),
      this.stakedPool("TWO_WEEK"),
      this.stakedPool('ONE_MONTH'),
      this.getRemainValue('TWO_WEEK'),
      this.getRemainValue('ONE_MONTH')
    ])
    return {
      totalStaker: req[0],
      twoWeekPoolRemain: req[1],
      oneMonthPoolRemain: req[2],
      totalStakedAmount: req[3],
      stakedPoolTwoWeek: req[4],
      stakedPoolOneMonth: req[5],
      remainValueTwoWeek: req[6],
      remainValueOneMonth: req[7],
    }
  }

  twoWeekStake = async(amount: number) => {
    const amountToEth = ethers.utils.parseEther(`${amount}`).toString();
    const tx: TransactionResponse = await this._contract.twoWeekStake(amountToEth, this._option);
    return this._handleTransactionResponse(tx);
  }
  
  oneMonthStake = async(amount: number) => {
    const amountToEth = ethers.utils.parseEther(`${amount}`).toString();
    const tx: TransactionResponse = await this._contract.oneMonthStake(amountToEth, this._option);
    return this._handleTransactionResponse(tx);
  }
 
  getStakerInfo = async(address: string): Promise<IStakerInfo[]> =>  {
    const res: IStakerInfo[] = await this._contract['getStakerInfo(address)'](address);
    const results: IStakerInfo[] = [];
    for (let i = 0; i < res.length; i++) {
      results.push({
        index: i,
        amount: parseBalance(res[i].amount),
        isRelease: res[i].isRelease,
        releaseDate: res[i].releaseDate,
        rewardDebt: parseBalance(res[i].rewardDebt),
        termOption: res[i].termOption,
        days: `${getDays(res[i].releaseDate)} days`,
        isLock: isAfter(res[i].releaseDate),
      })
      
    }
    return results;
  }

  onWithdraw = async(index: number) => {
    const tx  = await this._contract.unStake(index);
    return this._handleTransactionResponse(tx);
  }
}
