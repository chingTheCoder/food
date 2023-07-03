import CyclicDb from "@cyclic.sh/dynamodb"
const db = CyclicDb("jolly-lime-dolphinCyclicDB")

const animals = db.collection("animals")


// create an item in collection with key "leo"



async function run () {
    let leo = await animals.set("leo", {
        type: "cat",
        color: "orange"
        })
        
        // get an item at key "leo" from collection animals
        let item = await animals.get("leo")
        console.log(item)
}


run()