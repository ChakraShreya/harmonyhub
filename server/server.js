const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')
const authRoutes = require('./routes/auth')
const songRoutes = require('./routes/song')
const playlistRoutes = require('./routes/playlist')
const dbQuery = require('./models/DBconnect')

const app = express()
app.use(cors())
app.use(express.json())

const port = 8000;



let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log(jwt_payload)
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

app.post('/logout', (req, res) => {
    // Perform any additional logout logic if needed
  
    // Clear the 'token' cookie
    res.clearCookie('token');
  
    // Redirect to the login page or send a response indicating successful logout
    res.redirect('/login');
  });

app.use("/auth", authRoutes);

app.use("/song", songRoutes);

app.use("/playlist", playlistRoutes);


app.listen(port, ()=>{
    console.log('listening to port', port)
})