const express = require("express");
const router = express.Router();
const passport = require("passport");
const mysql = require("mysql");
const util = require("util");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "harmony_hub",
  port: 3306 // Default MySQL port is 3306
});

const dbQuery = util.promisify(db.query).bind(db);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
      return res
        .status(301)
        .json({ err: "Insufficient details to create song." });
    }
    const artist = req.user._id;
    const songDetails = { name, thumbnail, track, artist };
    const insertQuery = "INSERT INTO songs SET ?";
    try {
      const result = await dbQuery(insertQuery, songDetails);
      const createdSong = { id: result.insertId, ...songDetails };
      return res.status(200).json(createdSong);
    } catch (error) {
      return res.status(500).json({ err: "Error creating song" });
    }
  }
);

router.get(
  "/get/mysongs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const artistId = req.user._id;
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
  passport.authenticate("jwt", { session: false }),
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