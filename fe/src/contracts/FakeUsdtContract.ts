import { ethers } from "ethers";
import { Erc20 } from "./interfaces";
import { getFakeUsdtAbi } from "./utils/getAbis";
import { getFakeUsdtAddress } from "./utils/getAddress";

export default class FakeUsdtContract extends Erc20 {
  constructor(provider: ethers.providers.Web3Provider) {
    super(provider, getFakeUsdtAddress(), getFakeUsdtAbi());
  }
}