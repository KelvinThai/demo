const StoreCommand = require('./cStoreCommand');
const cStoreCommand = new StoreCommand.cStoreCommand();
const { pool } = require("../vaulConnectionPool")
const mysql = require('mysql2/promise');

class OffchainDAO {
  constructor() {
  }
  executeSqlStatement = async (sqlText, binds, count = 0) => {
    try {
      let [lstnft] = await pool.query(sqlText, binds, true);
      let result = lstnft;
      return result ?? true;
    }
    catch (ex) {
      console.log(`executeSqlStatement ${sqlText},${binds},${ex}`);
      count++;
      if (count < 4) {
        return this.executeSqlStatement(sqlText, binds, count);
      }
      //console.log(`executeSqlStatement ${sqlText},${ex}`);
      //console.log(`executeSqlStatement ${binds}`);
    }

    return null;
  }


  addPlayerVault = async (wallet_id) => {
    let date = parseInt(new Date().getTime() / 1000);
    await this.executeSqlStatement(cStoreCommand.AddPlayerVaultCommand, [wallet_id, date]);
  }

  getPlayerBalance = async (wallet_id) => {
    let result = await this.executeSqlStatement(cStoreCommand.GetPlayerBalanceCommand, [wallet_id]);
    if (result == null || result.length == 0)
      return null;
    return result[0].balance;
  }

  addPlayerBalanceTransaction = async (wallet_id, transaction_type, amount, transaction_date, transaction_id) => {
    return await this.executeSqlStatement(cStoreCommand.AddPlayerBalanceTransactionCommand, [
      wallet_id,
      transaction_type,
      amount,
      transaction_date,
      transaction_id
    ]);
  }

  addPlayerBalance = async (wallet_id, amount, transaction_id = null) => {
    let date = parseInt(new Date().getTime() / 1000);
    let result = await this.executeSqlStatement(cStoreCommand.AddPlayerBalanceCommand, [amount, wallet_id, amount]);
    if (result == null || result.length == 0)
      return null;

    result = await this.addPlayerBalanceTransaction(wallet_id, 1, amount, date, transaction_id);
    if (result == null) return null;
    return this.getPlayerBalance(wallet_id);
  }

  updateTransaction = async (id, transid) => {
    await this.executeSqlStatement(cStoreCommand.UpdateTransactionCommand, [transid, id]);
  }

  withdrawPlayerBalance = async (wallet_id, amount) => {
    let date = parseInt(new Date().getTime() / 1000);
    let result = await this.executeSqlStatement(cStoreCommand.WithdrawPlayerBalanceCommand, [amount, wallet_id, amount, amount]);
    if (result == null || result.length == 0)
      return null;
    let tx = await this.addPlayerBalanceTransaction(wallet_id, 2, amount, date, null);
    return { amount: amount, transid: tx };
  }
}

module.exports = OffchainDAO;