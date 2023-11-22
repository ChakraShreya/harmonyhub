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

const procedure = `DELIMITER //
CREATE PROCEDURE GetLikedSongs()
BEGIN
    SELECT *
    FROM songs
    WHERE name IN (SELECT name FROM likedSongs WHERE liked = 1);
END;
//
DELIMITER ;
`;