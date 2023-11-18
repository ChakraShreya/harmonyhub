const express = require("express");
const router = express.Router();
const passport = require("passport");
const mysql = require("mysql2");
const util = require("util");

const db_name = "har";

//put the authenticate using token passort back in each api call

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
  

router.post(
  "/create",
  async (req, res) => {
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
      return res
        .status(301)
        .json({ err: "Insufficient details to create song." });
    }
    // const artist = req.user._id;
    const artist = "abc";
    const songDetails = { name, thumbnail, track, artist };
    const insertQuery = "INSERT INTO songs SET ?";
    try {
      const result = await dbQuery(insertQuery, songDetails);
      // const createdSong = { id: result.insertId, ...songDetails };
      // return res.status(200).json(createdSong);
      return res.status(200).json({ data: "Song successfully created" });
    } catch (error) {
      return res.status(500).json({ err: "Error creating song" });
    }
  }
);

router.get(
  "/get/mysongs",
  async (req, res) => {
    // const artistId = req.user._id;
    const artistId = "abc";
    const query = "SELECT * FROM songs WHERE artist = ?";
    try {
      const result = await dbQuery(query, artistId);
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ err: "Error retrieving songs" });
    }
  }
);

router.get(
  "/get/artist/:artistId",
  async (req, res) => {
    const { artistId } = req.params;
    const query = "SELECT * FROM songs WHERE artist = ?";
    try {
      const result = await dbQuery(query, artistId);
      if (result.length === 0) {
        return res.status(301).json({ err: "Artist does not exist" });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ err: "Error retrieving songs" });
    }
  }
);

router.get(
  "/get/songname/:songName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { songName } = req.params;
    const query = "SELECT * FROM songs WHERE name = ?";
    try {
      const result = await dbQuery(query, songName);
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ err: "Error retrieving songs" });
    }
  }
);

module.exports = router;