import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { depositService, withdrawService } from "../../apis";
import CrowSaleContract from "../../contracts/CrowdSaleContract";
import IPTContract from "../../contracts/IPTContract";
import StakeContract, { IStakeInfo } from "../../contracts/StakeContract";
import UsdtContract from "../../contracts/UsdtContract";
import VaultContract from "../../contracts/VaultContract";
import { IPackage, IVaultModel, IWalletInfo, TOKEN } from "../../types";
import stores, { AppThunkDispatch, RootState } from "../store";
import { DEFAULT_MES } from "./account.reducers";

export const setProvider = createAction<ethers.providers.Web3Provider>(
  "account/setProvider"
);

export const generateContract = createAsyncThunk<
  IWalletInfo,
  ethers.providers.Web3Provider
>("account/generateContract", async (provider) => {
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const balance = await signer.getBalance();
  const bnb = Number.parseFloat(ethers.utils.formatEther(balance));
  const iptContract = new IPTContract(provider);
  const iptBalance = await iptContract.balanceOf(address);
  const crowdSaleContract = new CrowSaleContract(provider);
  const bnbRate = await crowdSaleContract.getBnbRate();
  const usdtRate = await crowdSaleContract.getUsdtRate();
  return { address, bnbBalance: bnb, iptBalance, bnbRate, usdtRate };
});

export const depositWithdrawAction = createAsyncThunk<string, IVaultModel>(
  "depositWithdrawAction",
  async (model) => {
    const { account } = stores.getState();
    if (model.from.token === TOKEN.IPT) {
      if (account.web3Provider) {
        const iptContract = new IPTContract(account.web3Provider);
        const vaultContract = new VaultContract(account.web3Provider);
        await iptContract.approve(
          vaultContract._contractAddress,
          model.from.value
        );
        const hash = await vaultContract.deposit(model.from.value);
        const rp = await depositService(
          account.walletInfo.address,
          model.from.value,
          hash
        );
        return hash;
      }
    } else {
      const rp = await withdrawService(
        account.walletInfo.address,
        model.from.value
      );
      return rp.txHash;
    }
    throw new Error(DEFAULT_MES);
  }
);

export const buyICOAction = createAsyncThunk<string, IPackage, {
  state: RootState
}>(
  "account/buyIco",
  async (pk, {getState}) => {
      const {web3Provider, walletInfo } = getState().account;
      if (!web3Provider) throw new Error(DEFAULT_MES);
      const crowdSaleContract = new CrowSaleContract(web3Provider);
      if (pk.token === TOKEN.USDT) {
        const usdtContract = new UsdtContract(web3Provider);
        await usdtContract.approve(crowdSaleContract._contractAddress, pk.amount / walletInfo.usdtRate);
        const hash = await crowdSaleContract.buyTokenByUSDT(pk.amount / walletInfo.usdtRate);
        return hash;
      } else {
        const hash = await crowdSaleContract.buyTokenByBNB(pk.amount / walletInfo.bnbRate);
        return hash;
      }
  }
);

export const getStakeInfoAction = createAsyncThunk<IStakeInfo>("account/getStakeInfo",
  async () => {
      const stakeContract = new StakeContract();
      const info  = await stakeContract.getStakeInfo();
      return info;
  }
);