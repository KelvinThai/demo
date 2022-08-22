import getChainIdFromEnv from "../../utils/getEnv";
import { AddressType, SMART_ADDRESS } from "./constants";


const getAddress = (address: AddressType) => {
  const CHAIN_ID = getChainIdFromEnv() as keyof AddressType ;
  return address[CHAIN_ID]
}; 

export const getIPTAddress = () => getAddress(SMART_ADDRESS.IPT);
export const getVaultAddress = () => getAddress(SMART_ADDRESS.VAULT);
export const getCrowdSaleAddress =()=> getAddress(SMART_ADDRESS.CROWD_SALE);
export const getUsdtAddress =()=> getAddress(SMART_ADDRESS.USDT);
export const getStakingAddress =()=> getAddress(SMART_ADDRESS.STAKING);
export const getLendingAddress =()=> getAddress(SMART_ADDRESS.LENDING);