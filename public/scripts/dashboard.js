//console.log('hello mate')

run()


async function run () {
    let orders = await fetch("/dashboard/order/get")
    let result = await orders.json()
    console.log(result) 
}