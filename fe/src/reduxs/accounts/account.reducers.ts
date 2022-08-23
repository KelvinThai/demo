import { createReducer } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { IStakeInfo } from "../../contracts/StakeContract";
import { IWalletInfo } from "../../types";

import {buyICOAction, depositWithdrawAction, generateContract, getStakeInfoAction, setProvider } from "./account.actions";


export const DEFAULT_MES = 'Something error!';

export interface AccountState {
  web3Provider?: ethers.providers.Web3Provider;
  walletInfo: IWalletInfo;
  convert: {
    isLoading: boolean;
    hash: string;
    errorMsg: string;
  },
  buyIco: {
    isProcessing: boolean;
    has: string,
    key: string,
    errMsg: string;
  },
  stakeInfo?: IStakeInfo;
}

const initialState: AccountState = {
  walletInfo: {
    iptBalance: 0,
    address: '',
    bnbBalance: 0,  
    bnbRate: 0,
    usdtRate: 0,  
  },
  convert: {
    isLoading: false,
    hash: '',
    errorMsg: '',
  },
  buyIco: {
    isProcessing: false,
    has: '',
    key: '',
    errMsg: '',
  },  
};

export const accountReducer = createReducer(initialState, (builder) => { 
  builder.addCase(setProvider, (state, { payload }) => {
    state.web3Provider  = payload;    
  }); 

  builder.addCase(generateContract.fulfilled, (state, {payload}) => {
      state.walletInfo = payload;
  });
  builder.addCase(generateContract.rejected, (state, action) => {
    const {error} = action;
    state.convert = {...state.convert, isLoading: false, errorMsg: error.message || DEFAULT_MES}
  });

  builder.addCase(depositWithdrawAction.pending, (state, action) => {
    state.convert = {...state.convert, isLoading: true, hash: ''};
  });

  builder.addCase(depositWithdrawAction.rejected, (state, action) => {
    const {error} = action;
    state.convert = {...state.convert, isLoading: false, errorMsg: error.message || DEFAULT_MES}
  });

  builder.addCase(depositWithdrawAction.fulfilled, (state, {payload}) => {
    state.convert = {...state.convert, isLoading: false, hash: payload}
  });

  //Buy ico
  builder.addCase(buyICOAction.pending, (state, {meta}) => {    
    const {arg} = meta;
    state.buyIco = {...state.buyIco, isProcessing: true, has: '', key: arg.key};
  });
  builder.addCase(buyICOAction.rejected, (state, {error}) => {
    state.buyIco= {...state.buyIco, isProcessing: false, errMsg: error.message || DEFAULT_MES};
  });
  builder.addCase(buyICOAction.fulfilled, (state, {payload}) => {
    state.buyIco= {...state.buyIco, isProcessing: false, errMsg: '', has: payload};
  });

  //Stake
  builder.addCase(getStakeInfoAction.fulfilled, (state, {payload})  => {
    state.stakeInfo = payload;
  });
});
