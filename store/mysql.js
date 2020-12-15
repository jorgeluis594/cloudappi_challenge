const mysql = require('mysql');

const { formatNestedData } = require('./format-mysql-data');

const config = require('../config');

const dbconf = { ...config.mysql };

let connection;

function handleCon() {
  connection = mysql.createConnection(dbconf);
  connection.connect((err) => {
    if (err) {
      console.error('[db error]', err);
      setTimeout(handleCon, 2000);
    } else {
      console.log('DB Connected');
    }
  });

  connection.on('error', (err) => {
    console.error('[db error]', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleCon();
    } else {
      throw err;
    }
  });
}

handleCon();

function list(table, join) {
  let joinQuery = '';
  if (join) {
    const key = Object.keys(join)[0];
    const val = join[key];
    joinQuery = `JOIN ${key} ON ${table}.id = ${key}.${val}`;
  }
  return new Promise((resolve, reject) => {
    connection.query(
      { sql: `SELECT * FROM ${table} ${joinQuery}`, nestTables: true },
      (err, data) => {
        if (err) reject(err);
        resolve(formatNestedData(data));
      }
    );
  });
}

function get(table, id) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (err, data) => {
      if (err) reject(err);
      if (!data.length) reject(new Error('invalid id'));
      resolve(data[0]);
    });
  });
}

function findByParams(table, params) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} WHERE ?`, params, (err, data) => {
      if (err) reject(err);
      resolve(data[0]);
    });
  });
}

function update(table, id, data) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data, id], async (err) => {
      if (err) return reject(err);
      const insertedData = await get(table, id);
      return resolve(insertedData);
    });
  });
}

function create(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO ${table} SET ?`, data, async (err, result) => {
      if (err) reject(err);
      const insertedData = await get(table, result.insertId);
      return resolve(insertedData);
    });
  });
}

function remove(table, id) {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM ${table} WHERE id=${id}`, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

module.exports = {
  list,
  get,
  findByParams,
  update,
  create,
  remove,
};
