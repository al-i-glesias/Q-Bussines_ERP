import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'
dotenv.config( { path: ".env" } )

function authMiddleware (req, res, next) {

    const auth_header = req.headers.authorization

    if(!auth_header) return res.status(401).json( { message: "Please authenticate before using the app" } )

    const token = auth_header.startsWith('Bearer ')
    ? auth_header.slice(7)
    : auth_header

    try {    
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

            if(err) return res.status(401).json({message: "invalid token"})

            req.user = decoded

            next()

        })
    } catch (err) {

        console.log(err.message)
    }
}

export function requireRole (...roles) {

    return (req, res, next) => {

        if(!req.user) return res.status(401).json( { message: "Unauthenticated"} )

        if(!roles.includes(req.user.role)) return res.staus(403).json( { message: "forbidden: insuficient permissions for this action" } )

        next()
    }
}
export default authMiddleware