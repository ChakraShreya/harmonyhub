const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')
const authRoutes = require('./routes/auth')
const songRoutes = require('./routes/song')

const app = express()
app.use(cors())
app.use(express.json())

const port = 8000;


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


// let opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';

// passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
//     // Assuming you have a MySQL connection named 'db'
//     // db.query('SELECT * FROM users WHERE id = ?', [jwt_payload.sub], (err, rows) => {
//     //     if (err) {
//     //         return done(err, false);
//     //     }

//     //     if (rows.length > 0) {
//     //         const user = rows[0];
//     //         return done(null, user);
//     //     } else {
//     //         return done(null, false);
//     //         // or you could create a new account
//     //     }
//     // });
//     async function getUser() {
//         try {
//           const [rows, fields] = await db.query('SELECT email FROM demousers WHERE email = ?', [email]);
      
//           if (rows.length > 0) {
//             const user = rows[0];
//             return done(null, user);
//           } else {
//             return done(null, false);
//           }
//         } catch (error) {
//           console.error('Error querying the database:', error.message);
//           return done(error, false);
//         }
//       }
// }));
  
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