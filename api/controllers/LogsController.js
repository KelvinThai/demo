'use strict';
const dao = require('../data/LogMonitorDAO');
const { v4: uuidv4 } = require('uuid');


async function _addLogs(domain_name, inputlogs) {
  try {
    let records = await inputlogs.map(q => {
      let id = uuidv4();
      let short_message = q.message == undefined ? undefined : q.message.substring(0, 150);
      return [[id, domain_name, q.process_name, q.request_url, q.log_type, q.log_timestamp, short_message],
      [id, q.message]
      ];
    });

    let logs = records.map(q => q[0]);
    let logDetails = records.filter(q => q[1][1] != undefined).map(q => q[1]);
    await dao.insert_logs(logs);
    if (logDetails.length > 0)
      await dao.insert_log_details(logDetails);
    return { logs: logs, logDetails: logDetails };
  } catch (error) {
    console.log(error);
    return null;
  }
}

exports.addLogs = async function (req, res) {
  try {
    let { logs } = req.body;
    let {domain_name} = req.query;
    if (logs) {
      var bls = await _addLogs(domain_name, logs);
      if (bls == null)
        return res.status(401).json(helper.APIReturn(101, "something wrongs"));
      return res.status(200).json(helper.APIReturn(0, "Success"));
    }

    return res.status(400).json(helper.APIReturn(1, "Logs not found"));

  } catch (error) {
    return res.status(401).json(helper.APIReturn(101, "something wrongs"));
  }
}


