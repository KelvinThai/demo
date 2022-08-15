'use strict';
const {apiKeyAuth, tokenAuth} = require('../controllers/helper');
module.exports = function(app) {
  var logApi = require('../controllers/LogsController');
  var vaulApi = require('../controllers/VaulController');
  var loginApi = require('../controllers/LoginController');

  app.post('/api/vauls/post_token',loginApi.post_token);

  app.use('/api/logs', apiKeyAuth);
  app.use('/api/vauls', tokenAuth);
  app.post('/api/logs/addLogs', logApi.addLogs);
  app.get('/api/vauls/getTicketBalance',vaulApi.getTitketBalance);
  app.get('/api/vauls/getBalance',vaulApi.getBalance);
  app.post('/api/vauls/deposit',vaulApi.deposit);
  app.post('/api/vauls/withdraw',vaulApi.withdraw);
};
