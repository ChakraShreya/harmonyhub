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

const createUserTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                firstName VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                lastName VARCHAR(255),
                email VARCHAR(255) NOT NULL,
                username VARCHAR(255) NOT NULL,
                likedSongs TEXT,
                likedPlaylists TEXT,
                subscribedArtists TEXT
            )
        `;
        await db.query(query);
        console.log('User table created successfully');
    } catch (err) {
        console.error(err);
    }
};

createUserTable();

module.exports = db;
