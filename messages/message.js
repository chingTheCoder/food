import CyclicDb  from "@cyclic.sh/dynamodb"
let db = CyclicDb("courageous-pear-snapperCyclicDB")
let users = db.collection('users')

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
    let response = await checkState(userInput, search, userId)
    return response
    
}


async function checkState (userInput, user, userId) {

    //send user to delivery
    if(user.props.state == 'nostate' && userInput == '1') {
        
        //set order choice to pickup
        await users.set(userId , {
                state : 'order',
                orderChoice : 'pickup'
        })

        return   {
            messaging_product : "whatsapp",
            to : userId,
            text : { body : `Tap link to see our menu${'\u261F'}\n\n https://adorable-shift-worm.cyclic.app/menu/255762992922/menu/${userId}`}
        }

    }

    //send user to pickup
    if(user.props.state == 'nostate' && userInput == '2') {
        
        await users.set(userId , {
            state : 'order',
            orderChoice : 'delivery'
        })
        return   {
            messaging_product : "whatsapp",
            to : userId,
            text : { body : `Tap link to see our menu${'\u261F'}\n\n https://adorable-shift-worm.cyclic.app/menu/255762992922/menu/${userId}`}
        }

    }

    return {
        messaging_product : "whatsapp",
        to : userId,
        text : { body : `type 1 for delivery and 2 for pickup`}
    }
    
}

export default message