import { BaseContract, ethers } from "ethers";
import { getRPC } from "../utils";
import { BaseInterface } from "./interfaces";
import { getLendingAbi } from "./utils/getAbis";
import { getLendingAddress } from "./utils/getAddress";

export default class LendingContract extends BaseInterface {
  constructor(provider?: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(getRPC());
    super(provider ?? rpcProvider, getLendingAddress(), getLendingAbi())
    if (!provider) {
      this._contract = new ethers.Contract(this._contractAddress, this._abis, rpcProvider);
    }
  }

  

}