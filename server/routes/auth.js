const express = require("express");
const router = express.Router();
const mysql = require('mysql2')
const bcrypt = require("bcrypt");
const {getToken} = require("../utils/helpers");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.mySQLPassword,
    database: 'harmony_hub',
    port: 3306 // Default MySQL port is 3306
  });

db.connect((err) => {
if (err) {
    console.error('Error while connecting to database:', err);
    return;
}
console.log('Connected to the database');
});


// This POST route will help to register a user
router.post("/register", async (req, res) => {
    // This code is run when the /register api is called as a POST request

    // My req.body will be of the format {email, password, firstName, lastName, username }
    const {email, password, firstname, lastname, username} = req.body;

    // Step 2 : Does a user with this email already exist? If yes, we throw an error.
    
    // This is a valid request

    // Step 3: Create a new user in the DB
    // Step 3.1 : We do not store passwords in plain text.
    // xyz: we convert the plain text password to a hash.
    // xyz --> asghajskbvjacnijhabigbr
    // My hash of xyz depends on 2 parameters.
    // If I keep those 2 parameters same, xyz ALWAYS gives the same hash.
    const hashedPassword = await bcrypt.hash(password, 10);
    // const hashedPassword = "123";
    const newUserData = {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        username,
    };
    // const [result] = db.query('INSERT INTO demousers SET ?', [newUserData]);

    // if (result.affectedRows === 1) {
    // console.log('User created successfully');
    // } else {
    // console.error('Error creating user');
    // }
    const result = db.query('INSERT INTO demousers SET ?', [newUserData]);
    // function objectsToJSON(arr) {
    //     return arr.map(obj => obj.toJSON ? obj.toJSON() : obj);
    // }
    
    // const newUser = objectsToJSON(result.values);
    // console.log(newUser)
    

    // // Step 4: We want to create the token to return to the user
    // const token = await getToken(email, newUser);

    // // Step 5: Return the result to the user
    // const userToReturn = {...newUser.toJSON(), token};
    // console.log(userToReturn);
    // delete userToReturn.password;
    return res.status(200).json(result.values);
});

router.post("/login", async (req, res) => {
    // Step 1: Get email and password sent by user from req.body
    const {email, password} = req.body;

    // Step 2: Check if a user with the given email exists. If not, the credentials are invalid.
    const [rows] = await db.query('SELECT * FROM users WHERE Email = ?', [email]);
    const user = rows[0];

    if (!user) {
        return res.status(403).json({ err: "Invalid credentials" });
    }

    console.log(user);

    // Step 3: If the user exists, check if the password is correct. If not, the credentials are invalid.
    // This is a tricky step. Why? Because we have stored the original password in a hashed form, which we cannot use to get back the password.
    // I cannot do : if(password === user.password)
    // bcrypt.compare enabled us to compare 1 password in plaintext(password from req.body) to a hashed password(the one in our db) securely.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // This will be true or false.
    if (!isPasswordValid) {
        return res.status(403).json({err: "Invalid credentials"});
    }

    // Step 4: If the credentials are correct, return a token to the user.
    const token = await getToken(user.email, user);
    const userToReturn = {...user.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

module.exports = router;