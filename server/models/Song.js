const mysql=require('mysql2');
const dotenv=require('dotenv');
dotenv.config();

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.mySQLPassword,
    database: 'harmony_hub',
    port: 3306 // Default MySQL port is 3306
}).promise();

const Song = `
CREATE TABLE IF NOT EXISTS songs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255) NOT NULL,
    track VARCHAR(255) NOT NULL,
    artist_id INT NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES users(id)
)`;

db.query(Song, (err, result) => {
    if (err) throw err;
    console.log("Songs table created successfully");
});

module.exports = db.promise();

