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
                product : productToAdd ,
                totalProducts : arrayOfProduct
            })

})

router.post('/sendmessage', async (req, res) => {

    let { mobilePhone, mobileId, products } = req.body

    //change the state of the user
    await users.set(mobilePhone, {
        state : 'orderCreated'
    })

    let generatedMessage = 'Your Order includes\n\n' 
    let totalPrice = 0
    let two = "\u{0032}\u{FE0F}\u{20E3}"
    let one = "\u{0031}\u{FE0F}\u{20E3}"
    let three = "\u{0033}\u{FE0F}\u{20E3}"

    for (let x = 0 ; x < products.length; x++) {

        let string = `${x + 1}. ${products[x].productName} @ ${products[x].productPrice}\n`
        generatedMessage = generatedMessage + string
        totalPrice = totalPrice + Number(products[x].productPrice)

    }

    generatedMessage = generatedMessage + `*Total Price* : ${totalPrice}\n\nType corresponding Number to proceed\n\n${one}. To *SEND* Order\n${two}. To REMOVE an Item from order\n${three}. To CANCEL order

    `
    
    //generate message 
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
    let facebookRequest2 =  await fetch(`https://graph.facebook.com/v12.0/${mobileId}/messages?access_token=${process.env.WHATSAPP_TOKEN}`, {
        method : 'post',
        headers : {"content-type" : "application/json"},
        body : JSON.stringify({
            messaging_product: "whatsapp",
            to: mobilePhone,
            text: { body : generatedMessage}
        })
    })
    let lastRequest = await facebookRequest2.json()
    console.log(lastRequest)
    res.json({ message : 'success'})


})



export default router