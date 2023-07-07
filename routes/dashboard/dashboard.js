import express from "express"
let router = express.Router()



import orders from './orders/order.js'

router.use('/order', orders)

router.get('/', (req, res) => {
    res.render('dashboard')
})






export default router