import { ethers } from "ethers";
import { Erc20 } from "./interfaces";
import { getIPTAbi } from "./utils/getAbis";
import { getIPTAddress } from "./utils/getAddress";

class IPTContract extends  Erc20 {
  constructor(provider: ethers.providers.Web3Provider) {  
      super(provider, getIPTAddress(), getIPTAbi())
  }
}

export default IPTContract;