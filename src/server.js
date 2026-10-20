//server initialization
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

//current active users working with the app
export const active_sessions = []


//enviroment
dotenv.config( { path: ".env" })


//routes
import users_router from './routes/users.js'
import products_router from './routes/products.js'

//authentication middleware
import authMiddleware from './authmiddleware/auth_middleware.js'


const app = express()
const PORT = process.env.PORT || 5005

//serve static content
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, '..', 'public')))

//midleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', users_router)
app.use('/products',authMiddleware , products_router)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/html/login-page.html'))
})

app.listen(PORT, () => console.log(`server running in http://localhost:${PORT}`))