import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

let db;

function handleDisconnect() {
  db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
  });

  db.connect(function (err) {
    if (err) {
      console.error('Error connecting to MySQL:', err.message);
      setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
    } else {
      console.log('Connected to MySQL successfully!');
    }
  });

  db.on('error', function (err) {
    console.error('MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Connection lost. Reconnecting...');
      handleDisconnect(); // Reconnect on connection loss
    } else {
      throw err; // Fatal error, let the application crash
    }
  });
}

handleDisconnect();

export default db;
