const mysql = require("mysql2");

const db_name = "har";

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.mySQLPassword,
    database: db_name,
    port: 3306 // Default MySQL port is 3306
  }).promise();
  
  db.getConnection().then(connection => {
  console.log('Connected to the database');
  connection.release();
  })
  .catch(error => {
  console.error('Error connecting to the database:', error.message);
  });
  
  async function dbQuery(query, params) {
    console.log(query)
    console.log(params)
    try {
      const [rows, fields] = await db.query(query, [params]);
  
      if (rows.length > 0) {
        const user = rows[0];
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error querying the database:', error.message);
      throw error;
    }
  }

module.exports = dbQuery;