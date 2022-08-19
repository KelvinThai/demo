import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { BaseInterface } from "./interfaces";
import { getCrowdSaleAbi } from "./utils/getAbis";
import { getCrowdSaleAddress } from "./utils/getAddress";

export default class CrowSaleContract extends BaseInterface {
  constructor(provider: ethers.providers.Web3Provider) {
    super(provider, getCrowdSaleAddress(), getCrowdSaleAbi());
  }

  async getBnbRate(): Promise<number> {
    let rate = await this._contract.BNB_rate();
    return this._toNumber(rate);
  }

  async getUsdtRate(): Promise<number> {
    const rate = await this._contract.USDT_rate();
    return this._toNumber(rate);
  }

  async buyTokenByBNB(amount: number) {
    const amountToEth = ethers.utils.parseEther(amount.toString()).toString();
    const tx: TransactionResponse = await this._contract.buyTokenByBNB({
      value: amountToEth,
    });
    return this._handleTransactionResponse(tx);
  }

  async buyTokenByUSDT(amount: number) {
    const amountToEth = ethers.utils.parseEther(`${amount}`).toString();
    const tx: TransactionResponse = await this._contract.buyTokenByUSDT(
      amountToEth,
      this._option
    );
    return this._handleTransactionResponse(tx);
  }
}
