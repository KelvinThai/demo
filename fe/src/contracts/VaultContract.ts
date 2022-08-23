import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { BaseInterface, Erc20 } from "./interfaces";
import { getVaultAbi } from "./utils/getAbis";
import { getVaultAddress } from "./utils/getAddress";

class VaultContract extends BaseInterface {
  constructor(provider: ethers.providers.Web3Provider) {      
      super(provider, getVaultAddress(), getVaultAbi())
  }

  async deposit(amount: number) {   
    const amountToEth = ethers.utils.parseEther(`${amount}`);
    const tx: TransactionResponse = await this._contract.deposit(amountToEth);
    return this._handleTransactionResponse(tx);
  }

}

export default VaultContract;