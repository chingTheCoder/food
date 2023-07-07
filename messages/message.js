import CyclicDb  from "@cyclic.sh/dynamodb"
let db = CyclicDb("courageous-pear-snapperCyclicDB")
let users = db.collection('users')
let orders = db.collection('orders')

async function message (userInput, username, userId, phoneId) {

    let two = "\u{0032}\u{FE0F}\u{20E3}"
    let one = "\u{0031}\u{FE0F}\u{20E3}"
    
    //search for user if in the database
    let search = await users.get(userId)
    console.log('search returned below value')
    console.log(search)
    if(search == null){
        console.log('user is not found in the database so create new user')
        //lets create the new user
        await users.set(userId , {
            phoneID : phoneId,
            state : 'nostate',
            subState : 'nostate',
            orderChoice : '',
            productList : [],
            ttl: Math.floor(Date.now() / 1000) + 3
         })
       
         return {
            messaging_product: "whatsapp",
            to: userId,
            text: { body : `Hello ${username}\nWelcome to *ARBYS*\nWrite one of the below number for your request\n\n${one} Pickup\n${two} Delivery`}
          }

    }
  
    console.log('user is not new')
    let response = await checkState(userInput, search, userId, phoneId, username)
    return response
    
}


async function checkState (userInput, user, userId, phoneId, username) {

    //the big if
    if (user.props.state == 'nostate') {
    //send user to delivery
                if(userInput == '1') {
                    
                    //set order choice to pickup
                    await users.set(userId , {
                            state : 'order',
                            orderChoice : 'pickup'
                    })

                    return   {
                        messaging_product : "whatsapp",
                        to : userId,
                        text : { body : `Tap link to see our menu${'\u261F'}\n\n https://courageous-pear-snapper.cyclic.app/menu/${userId}`}
                    }

                }

                //send user to pickup
                if(userInput == '2') {
                    
                    await users.set(userId , {
                        state : 'order',
                        orderChoice : 'delivery'
                    })
                    return   {
                        messaging_product : "whatsapp",
                        to : userId,
                        text : { body : `Tap link to see our menu${'\u261F'}\n\n https://courageous-pear-snapper.cyclic.app/menu/${userId}`}
                    }

                }

                

                return {
                    messaging_product : "whatsapp",
                    to : userId,
                    text : { body : `Type 1 for delivery and 2 for pickup`}
                }

    }

    //when order has being created
    if (user.props.state == 'orderCreated') {

                orders.set(userId, {
                    custonername : username,
                    customerPhoneId : phoneId,
                    listOfProducts : user.props.productList,
                    orderState : 'processing',
                    ttl : Math.floor(Date.now() / 1000) + 10
                })

                if(userInput == '1') {
                    //save order to the database
                    return {
                        messaging_product : "whatsapp",
                        to : userId,
                        text : { body : `Your Order has being received you will be contacted within 2 hours ${"\uD83D\uDE03"}`}

                    } 
                }

                if(userInput == '2') {

                    await users.set(userId, {
                        state : 'removingItem'
                    })

                    return {
                        messaging_product : "whatspp",
                        to : userId,
                        text : { body : "Below is the list of items to remove type a corresponding number to remove"}
                    }

                }

                if(userInput == '3') {

                    await users.set(userId, {
                        state : 'orderCanceled'
                    })

                    return {
                        messaging_product : "whatsapp",
                        to : userId,
                        text : { body : `Your Order has being canceled ${"\uD83D\UDE26"}`}
                    }
                }
                
                return {
                    messaging_product : "whatsapp", 
                    to : userId,
                    text : { body : "Type 1 to send order 2 to remove items and 3 to cancel order"}
                }

    }
    
}

export default message