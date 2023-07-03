import express from "express"
let router = express.Router()
import CyclicDb  from "@cyclic.sh/dynamodb"
let db = CyclicDb("jolly-lime-dolphinCyclicDB")


let users = db.collection('users')


router.use(express.json())

router.get('/:userId', async (req, res) => {
    //console.log(req.params)
    // let getUserInfo = await users.get(req.params.userId)
    //console.log(getUserInfo)
    res.render('menu')
})


router.post('/addtocart', async (req, res) => {
    
    let { id , productToAdd } = req.body
    console.log(id)
    console.log(productToAdd)
    let user = await users.get(id)
    console.log(user.props.productList) 
    let arrayOfProduct = user.props.productList
    arrayOfProduct.push(productToAdd)
    let newValues = await users.set(id, {
        productList : arrayOfProduct
    })
    console.log('updated values are')
    console.log(newValues)
    //get user products
    res.json({ 
                response : true , 
                phoneid : user.props.phoneID,
                product : productToAdd 
            })

})

router.post('/sendmessage', (req, res) => {

        let mobile = req.body
        console.log(mobile)
        res.status(200)

})





export default router