import express from 'express'
import db from '../db.js'
import bcrypt from 'bcrypt'

const router = express.Router()

router.post('/register', (req, res) => {

    const {username, password } = req.body
    const hashed_password = bcrypt.hashSync(password, 8)

    if(!username || !password) return res.status(400).json( 
        { 
            error: "invalid field username and password"
        }
    )

    db.get(`SELECT * FROM users WHERE user_name = ?`, [username], (err, row) => {
        if(err) return res.status(400).json( {error: err.message} )
        if(row) return res.status(400).json( {error: "user already exists"})

        db.run(`INSERT INTO users (user_name, password) VALUES (?, ?)`, [username, hashed_password], function(err) {

            if(err) return res.status(500).json( {error: "pipisito"})
            res.json( {message: "User created succesfully", id: this.lastID, _password: hashed_password})
        })
    })
})

router.post('/login', (req, res) => {

    console.log(req.body)
    
    const { username, password } = req.body

    db.get(`SELECT * FROM users WHERE user_name = ? AND password = ?`, [username, password], (err, row) => {

        if(err) return res.status(500).json( {error: err.message} )
        if(!row) return res.status(401).json( {error: "invalid credentials"} )

        res.json( {message: "login succesful", usuario: row.user_name })
    })
})

export default router


