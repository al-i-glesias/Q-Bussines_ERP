//server initialization
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

//enviroment
dotenv.config( { path: ".env" })


//routes
import router from './authRoutes/users.js'

//database
import db from './db.js'

const app = express()
const PORT = process.env.PORT || 5005

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//midleware
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', router)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/html/login-page.html'))
})

app.listen(PORT, () => console.log(`server running in http://localhost:${PORT}`))