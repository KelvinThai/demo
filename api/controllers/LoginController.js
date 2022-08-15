'use strict';
const Web3 = require('web3');
var web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');

async function get_token(address, signature, message) {
    try {

        let hash = web3.utils.sha3(message);

        //let signing_address = await web3.eth.personal.ecRecover(hash, signature);
        let signing_address = await web3.eth.accounts.recover(hash, signature);

        if (signing_address == null || address !== signing_address) {
            return null;
        }
        let signdate = parseInt(message.substring(message.lastIndexOf('-') + 1));
        console.log(signdate);
        let now = new Date;
        let utc_timestamp = Math.floor(now.getTime() / 1000);
        console.log("delay: " + utc_timestamp);
        console.log("delay: " + (utc_timestamp - signdate));
        if ((utc_timestamp - signdate) > 5000) {

            return null;
        }

        let user = new oUserInfo(signing_address);

        let token = await helper.sign_token(user);

        let testUser = await helper.verify_token(token);
        console.log(testUser);
        let data = {};
        data.address = address;
        data.expriedIn = 120;
        data.token = token;
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

exports.post_token = async function (req, res) {
    try {
        let { address, signature, message } = req.body;
        let dp = await get_token(address, signature, message);
        if (dp !== null) {
            return res.status(200).json(helper.APIReturn(0, dp, "success"));
        }
        else return res.status(401).json(helper.APIReturn(1, "something wrongs"));
    } catch (error) {
        return res.status(401).json(helper.APIReturn(1, "something wrongs"));
    }
}