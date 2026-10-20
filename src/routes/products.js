import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {

    const products = db.all(`SELECT * FROM products`, (err, rows) => {

        if(err) return res.status(502).json( {message: err.message} )
        if(!rows) return res.status(404).json( { message: "couldn't find any products" } )

        res.json(rows)
    })

})
router.post('/', (req, res) => {

    const { name, price, category, description, stock, date } = req.body


    try {
        db.run(`INSERT INTO products(name, price, category, description, stock, date) values(?, ?, ?, ?, ?, ?)`, [name, category, description, stock, date],
            function(err) {
                
                if(err) return res.status(503).json( { message: `serverside error, could not add product: ${{...req.body}} + ${err.message}` } )
                return res.status(201).json( { message: "Product added successfully", product: {...req.body}} )
            }
        )
    } catch (err) {

        console.log(err.message)
    }
})
//router.patch()
//router.delete()


export default router