const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/User");

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.mySQLPassword,
    database: 'harmony_hub',
    port: 3306 // Default MySQL port is 3306
});

db.query = util.promisify(db.query);

module.exports = db;

router.post(
    "/create",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        // req.user getss the user because of passport.authenticate
        const {name, thumbnail, track} = req.body;
        if (!name || !thumbnail || !track) {
            return res
                .status(301)
                .json({err: "Insufficient details to create song."});
        }
        const artist = req.user._id;
        const songDetails = {name, thumbnail, track, artist};
        const createdSong = await Song.create(songDetails);
        return res.status(200).json(createdSong);
    }
);

// Get route to get all songs I have published.
router.get(
    "/get/mysongs",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        // We need to get all songs where artist id == currentUser._id
        const query = `SELECT * FROM songs WHERE artist = ?`;
        db.query(query,[req.user._id],(err, result) => {
            if (err) {
                return res.status(500).json({err: "Error retrieving songs"});
            }
            return res.status(200).json({data: result});
        });
    }
);

// Get route to get all songs any artist has published
// I will send the artist id and I want to see all songs that artist has published.
router.get(
    "/get/artist/:artistId",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const {artistId} = req.params;
        // We can check if the artist does not exist
        const query = `SELECT * FROM songs WHERE artist = ?`;
        db.query(query,[artistId],(err, result) => {
            if (err) {
                return res.status(500).json({err: "Error retrieving songs"});
            }
            if (result.length === 0) {
                return res.status(301).json({err: "Artist does not exist"});
            }
            return res.status(200).json({data: result});
        });
    }
);

// Get route to get a single song by name
router.get(
    "/get/songname/:songName",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const {songName} = req.params;

        const query = `SELECT * FROM songs WHERE name = ?`;
        db.query(query,[songName],(err, result) => {
            if (err) {
                return res.status(500).json({err: "Error retrieving songs"});
            }
            return res.status(200).json({data: result});
        });
    }
);

module.exports = router;
