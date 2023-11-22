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

const Trigger = `CREATE TRIGGER after_song_delete 
    AFTER DELETE ON songs 
    FOR EACH ROW 
    BEGIN 
        -- Delete from playlist table
        DELETE FROM playlist WHERE playlist.name = OLD.song.name; 

        -- Delete from liked_songs table
        DELETE FROM likedSongs WHERE likedSongs.name = OLD.song.name; 
    END;
    //
    DELIMITER ;`;