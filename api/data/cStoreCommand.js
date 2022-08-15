class cStoreCommand {
    constructor() {
        this.AddPlayerVaultCommand =
            `INSERT IGNORE INTO tbl_player_vault(wallet_id, created_date, balance)
            VALUES(lower(?), ?, 10)`;

        this.GetPlayerBalanceCommand = `SELECT * FROM tbl_player_vault WHERE wallet_id = lower(?) AND STATUS = 1`;

        this.AddPlayerBalanceCommand =
            `UPDATE tbl_player_vault SET balance = balance + ?
            WHERE wallet_id = lower(?) AND ? >= 0;`;

        this.WithdrawPlayerBalanceCommand =
            `UPDATE tbl_player_vault SET balance = balance - ?
            WHERE wallet_id = lower(?) AND balance >= ? AND ? > 0;`;

        this.AddPlayerBalanceTransactionCommand =
            `INSERT INTO tbl_vault_transaction (wallet_id, transaction_type, amount, transaction_date,transaction_id)
            VALUES(lower(?), ?, ?, ?, ?)`;

        this.UpdateTransactionCommand =
            `UPDATE tbl_vault_transaction SET transaction_id = ?
            WHERE id =?`;
    }
}

exports.cStoreCommand = cStoreCommand;