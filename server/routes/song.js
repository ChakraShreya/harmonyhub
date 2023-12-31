const express = require("express");
const router = express.Router();
const passport = require("passport");
const mysql = require("mysql2");
const util = require("util");
const dbQuery = require("../models/DBconnect");

//put the authenticate using token passort back in each api call

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.mySQLPassword,
  database: 'har',
  port: 3306 // Default MySQL port is 3306
});

connection.connect();

// const q = 'SELECT * FROM users';

// connection.query(q, (error, results, fields) => {
//   if (error) {
//     console.error(error);
//     throw error;
//   }

//   return results;
// });

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
    // const query = "SELECT * FROM songs WHERE artist = ?";
    // try {
    //   const result = await dbQuery(query, [artistId]);
    //   console.log("result of the query: ", query, "is ", result);
    //   return res.status(200).json({ data: [result] });
    // } catch (error) {
    //   return res.status(500).json({ err: "Error retrieving songs" });
    // }
    const q = `SELECT * FROM songs where artist = "${artistId}"`;
    
    try{
      connection.query(q, (error, results, fields) => {
        if (error) {
          console.error(error);
          throw error;
        }
        console.log("results of the query ", q, "is: ", results);
        return res.status(200).json({ data: results });
      });
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

router.post(
  "/like",
  async (req, res) => {
    const { songId, songName } = req.body;
    const query = "update likedSongs set liked = 1 where name = ?";
    try {
      const result = await dbQuery(query, songName);
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ err: "Error retrieving songs" });
    }
  }
)

router.get(
  "/get/likedSongs",
  async (req, res) => {
    console.log("here")
    const q = "SELECT * FROM songs WHERE name IN (SELECT name FROM likedSongs WHERE liked = 1)";
    try{
      connection.query(q, (error, results, fields) => {
        if (error) {
          console.error(error);
          throw error;
        }
        console.log("results of the query ", q, "is: ", results);
        return res.status(200).json({ data: results });
      });
    } catch (error) {
      return res.status(500).json({ err: "Error retrieving songs" });
    }
  }
)

router.get(
  "/delete/:songName",
  async (req, res) => {
    const {songName} = req.params;
    console.log("console output: ", req.params)
    // const query = "delete from songs where name = ?";
    const query = `delete from songs where name = "${songName}"`;
    console.log("query is: ", query);
    try {
      const result = await dbQuery(query, songName);
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ err: "Error retrieving songs" });
    }
  }
)

module.exports = router;