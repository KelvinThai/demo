'use strict';
const OffchainDAO = require('../data/OffchainDAO');
const SmartContractDAO = require('../data/SmartContractDAO');

async function getBalance(Address) {

    let dao = new SmartContractDAO();
    return await dao.getBalance(Address);
}

async function addPlayer(address) {
    try {
        let dao = new OffchainDAO();
        return await dao.addPlayerVault(address);
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getTicketBalance(address) {
    let dao = new OffchainDAO();
    try {
        await dao.addPlayerVault(address);
    }
    catch { }
    try {
        return await dao.getPlayerBalance(address);
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function addTicketBalance(address, amount, transaction_id) {
    try {
        let dao = new OffchainDAO();
        await dao.addPlayerVault(address);
        return await dao.addPlayerBalance(address, amount, transaction_id);
    } catch (error) {
        console.log(`add ticket balance: ` + error);
        return null;
    }
}

async function withdrawTicketBalance(address, amount) {
    try {
        let dao = new OffchainDAO();
        //await dao.AddPlayerVault(address);
        //await dao.AddPlayerBalance(address, amount*2);
        let result = await dao.withdrawPlayerBalance(address, amount);

        return result;

    } catch (error) {
        console.log(error);
    }
    return null;
}

async function updateTransaction(id, transid) {
    try {
        let dao = new OffchainDAO();
        //await dao.AddPlayerVault(address);
        //await dao.AddPlayerBalance(address, amount*2);
        let result = await dao.updateTransaction(id, transid);

        return result;

    } catch (error) {
        console.log(error);
    }
    return null;
}

exports.addPlayer = async function (req, res) {
    try {
        var bls = await addPlayer(req.query.address);
        if (bls == null)
            return res.status(401).json(helper.APIReturn(101, "something wrongs"));
        return res.status(200).json(helper.APIReturn(0, { "balances": bls }, "Success"));

    } catch (error) {
        return res.status(401).json(helper.APIReturn(101, "something wrongs"));
    }
}

exports.getBalance = async function (req, res) {
    try {
        var bls = await getBalance(req.query.address);
        if (bls == null)
            return res.status(401).json(helper.APIReturn(101, "something wrongs"));
        return res.status(200).json(helper.APIReturn(0, { "balances": bls }, "Success"));

    } catch (error) {
        return res.status(401).json(helper.APIReturn(101, "something wrongs"));
    }
}

exports.getTitketBalance = async function (req, res) {
    try {
        var bls = await getTicketBalance(req.query.address);
        if (bls == null)
            return res.status(401).json(helper.APIReturn(101, "something wrongs"));
        return res.status(200).json(helper.APIReturn(0, { "balances": bls }, "Success"));

    } catch (error) {
        console.log(error);
        return res.status(401).json(helper.APIReturn(101, "something wrongs"));
    }
}

exports.withdraw = async function withdraw(req, res) {
    try {
        let { address, amount } = req.body;
        if (address === undefined || amount === undefined || amount <= 0) {
            return res.status(400).json(helper.APIReturn(101, "bad request"));
        }

        let result = await withdrawTicketBalance(address, amount);
        if (result == null) {
            return res.status(400).json(helper.APIReturn(102, "bad request"));
        }
        console.log("call smart contract");
        let dao = new SmartContractDAO.SmartContractDAO();
        let trans = await dao.withdraw(address, result.amount);
        await updateTransaction(result.transid, trans);
        return res.status(200).json(helper.APIReturn(0, { amount: result.amount, txHash: trans }, "success"));

    } catch (error) {
        console.log(error);
        return res.status(500).json(helper.APIReturn(101, "something wrongs"));
    }
}

exports.deposit = async function deposit(req, res) {
    try {
        let { address, amount, transaction_id } = req.body;
        if (address === undefined || amount === undefined || amount <= 0 || transaction_id === undefined) {
            return res.status(400).json(helper.APIReturn(101, "bad request"));
        }
        let result = await addTicketBalance(address, amount, transaction_id);
        if (result == null) {
            return res.status(400).json(helper.APIReturn(102, "bad request"));
        }
        return res.status(200).json(helper.APIReturn(0, { result }, "success"));
    } catch (error) {
        console.log(error);
        return res.status(500).json(helper.APIReturn(101, "something wrongs"));
    }
}
