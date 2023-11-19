const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')
const authRoutes = require('./routes/auth')
const songRoutes = require('./routes/song')
const dbQuery = require('./models/DBconnect')

const app = express()
app.use(cors())
app.use(express.json())

const port = 8000;


// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: process.env.mySQLPassword,
//     database: 'harmony_hub',
//     port: 3306 // Default MySQL port is 3306
//   });

// db.connect((err) => {
// if (err) {
//     console.error('Error while connecting to database:', err);
//     return;
// }
// console.log('Connected to the database');
// });


let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    const result = await dbQuery('SELECT * FROM users WHERE id = ?', [jwt_payload.sub]);
    if(result.length > 0){
        return done(null, result[0]);
    }
    else{
        return done(null, false);
    }
}))
  
app.get('/', (req, res) => {
    const sql = 'select * from albums';
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.use("/auth", authRoutes);

app.use("/song", songRoutes);

app.listen(port, ()=>{
    console.log('listening to port', port)
})