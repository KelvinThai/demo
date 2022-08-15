const mysql = require('mysql2/promise');
const sql_folder = './data/sql/';
const {pool} = require("../logConnectionPool")
const fs = require('fs');

const executeSqlStatement = async (sqlText, binds, count = 0) => {
  try {
    let [lstnft] = await pool.query(sqlText, binds, true);
    let result = lstnft;
    return result;
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

const read_sql_content = (fileName) => {
  return fs.readFileSync(`${sql_folder}${fileName}.sql`, 'utf-8');;
}

const insert_logs = async (params) => {
  let sql = read_sql_content('insert_logs_statement');
  return executeSqlStatement(sql, [params]);
}

const insert_log_details = async (params) => {
  let sql = read_sql_content('insert_log_details_statement');
  return executeSqlStatement(sql, [params]);
}


module.exports = {
  insert_logs: insert_logs,
  insert_log_details: insert_log_details
}