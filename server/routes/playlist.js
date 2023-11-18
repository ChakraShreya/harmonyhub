const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const util = require("util");

const db_name = "har"; // Define the database name

// Create a MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.mySQLPassword,
  database: db_name,
  port: 3306 // Default MySQL port is 3306
}).promise();

// Function to handle database queries
async function dbQuery(query, params) {
  try {
    const [rows, fields] = await db.query(query, [params]);

    if (rows.length > 0) {
      return rows;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error querying the database:', error.message);
    throw error;
  }
}

// 4 functionalities
// Create a new playlist
router.post("/create", async (req, res) => {
  const { name, thumbnail, songs, owner_id } = req.body;
  if (!name || !thumbnail || !songs || !owner_id) {
    return res.status(400).json({ err: "Insufficient details to create playlist." });
  }

  const playlistDetails = { name, thumbnail, songs, owner_id};
  const insertQuery = "INSERT INTO playlist SET ?";
  
  try {
    const result = await dbQuery(insertQuery, playlistDetails);
    return res.status(200).json({ data: "Playlist successfully created" });
  } catch (error) {
    return res.status(500).json({ err: "Error creating playlist" });
  }
});

// Get playlist by playlist ID
router.get("/get/playlist/:playlistId", async (req, res) => { 
  const { playlistId } = req.params;
  const query = "SELECT * FROM playlist WHERE id = ?";
  
  try {
    const result = await dbQuery(query, playlistId);
    if (!result) {
      return res.status(404).json({ err: "Playlist not found" });
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ err: "Error retrieving playlist" });
  }
});

// Get all playlists made by an artist
router.get("/byArtist/:artistId", async (req, res) => {
    const { artistId } = req.params;
    if (!artistId ) {
        return res.status(400).json({ err: "Insufficient details to fetch playlist." });
    }
    const query = "SELECT * FROM playlist WHERE owner_id = ?";
    
    try {
      const result = await dbQuery(query, artistId);
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ err: "Error retrieving playlists" });
    }
  });

// Add a song to a playlist
router.post("/:playlistId/addSong", async (req, res) => {
    const { playlistId } = req.params;
    const { userId, songId } = req.body;
    
    // Check if the user is the owner or collaborator of the playlist
    
    const checkOwnershipQuery = "SELECT * FROM playlist WHERE (owner_id = ? OR id IN (SELECT playlist_id FROM playlist_collaborators WHERE collaborator_id = ?)) AND id = ?";
    try {
      const ownershipCheck = await dbQuery(checkOwnershipQuery, [userId, userId, playlistId]);
      if (!ownershipCheck || ownershipCheck.length === 0) {
        return res.status(401).json({ err: "User is not authorized to modify this playlist" });
      }
  
      // Check if the song is a valid song
      
      const checkSongQuery = "SELECT * FROM song WHERE id = ?";
      const songCheck = await dbQuery(checkSongQuery, songId);
      if (!songCheck || songCheck.length === 0) {
        return res.status(404).json({ err: "Song not found" });
      }
      
      // Add the song to the playlist
    
    const insertSongQuery = "INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)";
    const result = await dbQuery(insertSongQuery, [playlistId, songId]);
    return res.status(200).json({ data: "Song added to playlist" });
  } catch (error) {
    return res.status(500).json({ err: "Error adding song to playlist" });
  }
});

module.exports = router;
