import express from "express"
let router = express.Router()
import CyclicDb  from "@cyclic.sh/dynamodb"
let db = CyclicDb("courageous-pear-snapperCyclicDB")
let orders = db.collection('orders')

router.get('/get', async (req, res) => {
    let allorder = await orders.list()
    console.log(allorder)
    res.json({
        list : allorder
    })
})



export default router