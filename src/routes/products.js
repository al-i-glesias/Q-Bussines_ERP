import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {

    db.all(`SELECT * FROM products`, (err, rows) => {

        if(err) return res.status(502).json( {message: err.message} )
        if(!rows) return res.status(404).json( { message: "couldn't find any products" } )

        res.json(rows)
    })

})

router.get('/:id', (req, res) => {

    const { id } = req.params


    db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, row) => {

        if(err) return res.status(500).json( { message: `Serverside error: message: ${err.message}` } )
        if(!row) return res.status(404).json( { message: "Product not found, operation aborted" } )

        return res.status(201).json( { fetch_result: {...row} } )

    })

})

router.post('/', (req, res) => {

    const { name, price, category, description, stock, date } = req.body


    try {
        db.run(`INSERT INTO products(name, price, category, description, stock, date) values(?, ?, ?, ?, ?, ?)`, [name, price, category, description, stock, date],
            function(err) {
                
                if(err) return res.status(503).json( { message: `serverside error, could not add product: ${{...req.body}} + ${err.message}` } )
                return res.status(201).json( { message: "Product added successfully", product: { id: this.lastID, ...req.body}} )
            }
        )
    } catch (err) {

        console.log(err.message)
    }
})

router.put('/:id', (req, res) => {

    const { id } = req.params

    const fields = []; const values = []

    for ( const [key, value] of Object.entries(req.body)) {

        fields.push(`${key} = ?`)
        values.push(value)
    }

    if (fields.length === 0) return res.status(400).json({ message: "No fields to update" })

    values.push(id)

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`
    
    db.run(sql, values, function (err) {

        if (err) return res.status(500).json({message: `Servrside error: ${err.message}`})
        if(!this.changes) return res.status(404).json({message: 'Product not found, nothing to update'})

        return res.status(201).json({message: "Product updated successfully"})
    })
})


router.delete("/:id", (req, res) => {

    const { id } = req.params

    db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {

        if(err) return res.status(500).json( { message: `Serverside error: ${err.message}` } )
        if(!this.changes) return res.status(404).json( { message: "Product not found, operation aborted" } )

        return res.json( { message: "Product deleted successfully" } )
    })
})


export default router