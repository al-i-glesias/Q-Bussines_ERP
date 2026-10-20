import express from 'express'
import db from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

//active users array from the server
import { active_sessions } from '../server.js'

dotenv.config( { path: ".env" } )

const router = express.Router()

router.post('/register', (req, res) => {

    const {username, password } = req.body
    const hashed_password = bcrypt.hashSync(password, 8)
    console.log(hashed_password)

    if(!username || !password) return res.status(400).json( 
        { 
            error: "invalid field username and password"
        }
    )

    db.get(`SELECT * FROM users WHERE user_name = ?`, [username], (err, row) => {
        if(err) return res.status(400).json( {error: err.message} )
        if(row) return res.status(400).json( {error: "user already exists"})

        db.run(`INSERT INTO users (user_name, password) VALUES (?, ?)`, [username, hashed_password], function(err) {

            if(err) return res.status(500).json( {error: err.message})
            res.json( {message: "User created succesfully", id: this.lastID, username: username})
        })
    })
})

router.post('/login', (req, res) => {
    
    const { username, password } = req.body


    try{
        db.get(`SELECT * FROM users WHERE user_name = ? `, [username], (err, row) => {

            if(err) return res.status(500).json( {error: err.message} )
            if(!row) return res.status(401).json( {error: "invalid credentials"} )

            const is_valid_pass = bcrypt.compareSync(password, row.password)

            if(is_valid_pass) {
                
                const token = jwt.sign({id: row.user_id, username: row.user_name, role: row.role}, process.env.JWT_SECRET, {expiresIn: '1h'} )
                active_sessions.push({...row.user_id, token})
                return res.json( {message: "login succesful", user: row.user_name, id:row.user_id, token: token })
            }

            return res.status(403).json( {message: 'invalid credentials'} )
        })

    } catch (err) {
        console.log(err.message)
    }
})

export default router


