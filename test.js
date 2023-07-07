import CyclicDb from "@cyclic.sh/dynamodb"
const db = CyclicDb("courageous-pear-snapperCyclicDB")

let orders = db.collection('orders')

async function run () {
    let allorder = await orders.list()
    console.log(allorder.results[0].props)
}

run()