import express from "express"
let router = express.Router()
import CyclicDb  from "@cyclic.sh/dynamodb"
let db = CyclicDb("courageous-pear-snapperCyclicDB")


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

router.post('/sendmessage', async (req, res) => {

        let { mobilePhone, mobileId } = req.body
    
     
    let facebookRequest = await fetch(`https://graph.facebook.com/v12.0/${mobileId}/messages?access_token=${process.env.WHATSAPP_TOKEN}`, {
            method : 'post',
            headers : {"content-type" : "application/json"},
            body : JSON.stringify({
                messaging_product: "whatsapp",
                to: mobilePhone,
                text: { body : 'your selection was received'}
            })
        })
    let facebookResponse = await facebookRequest.json()
    console.log(facebookResponse)
    res.json({ message : 'success'})


})






export default router