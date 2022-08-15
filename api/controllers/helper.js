const jwt = require('jsonwebtoken');

const apiKeys = [
    "e21e62de-e5c7-4633-86b5-37652b3d54fe-e58d13af-e508-4509-b31e-bc0f2bca5098",//dequest
    "0770c97f-d317-414f-99d1-8a7724e4378a-a0ada90c-2cb3-4e14-b865-57a1f911c7e1" //stman
];

const domain_names = [
    "Dequest",//dequest
    "Stman" //stman
];

module.exports.APIReturn = function (code = 0, data = {}, mess = "") {
    if (code === 503) {
        code = 10;
        if (mess !== "")
            mess = "Miss fiend"
    }
    if (typeof data === 'string') {
        mess = data;
        data = {};
    }
    return {
        code, data, mess
    }
};

module.exports.sign_token = async function (object) {
    try {
        return await jwt.sign({...object}, process.env.PRIVATE_KEY_JSONTKEN, {expiresIn: '1d'});
    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports.verify_token = async function (token) {
    try {
        let result;
        result= jwt.verify(token,process.env.PRIVATE_KEY_JSONTKEN);
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports.apiKeyAuth = async function (req, res, next) {
    try {
        let apiKey = req.header("x-api-key");
        if (apiKey) {
            if (apiKeys.includes(apiKey)) {
                req.query.domain_name = domain_names[apiKeys.indexOf(apiKey)];
                return next();
            }
            return res.status(300).json(helper.APIReturn(1, 'x-api-key is requied'));
        }
        return res.status(300).json(helper.APIReturn(1, 'x-api-key is requied'));
    } catch (e) {
        console.log(e);
        return res.status(500).json(helper.APIReturn(1, "Something errors"))
    }
}



module.exports.tokenAuth = async function (req, res, next) {
    try {
        if (req.headers.authorization) {
            let address = req.method == 'GET'? req.query.address : req.body.address;
            const parseToken = req.headers.authorization.split(' ');
            if (parseToken[0] === 'Bearer' && parseToken[1]) {
                const getToken = await helper.verify_token(parseToken[1]);
                if (getToken) {
                    console.log("getToken"+ getToken.address);
                    console.log("address"+ address);
                    if(address != null && getToken.address != address){
                        return res.status(400).json(helper.APIReturn(1, 'Token is invalid'));
                    }
                    return next();
                }
                return res.status(300).json(helper.APIReturn(1, 'Token is requied'));
            }
        }

        return res.status(300).json(helper.APIReturn(1, 'Token is requied'));
    } catch (e) {
        console.log(e);
        return res.status(500).json(helper.APIReturn(1, "Something errors"))
    }
}
