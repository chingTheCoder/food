document.addEventListener("DOMContentLoaded", async function(event){
    // your code here
    let orders = await fetch("/dashboard/order/get")
    let response = await orders.json()
    //remove loading element
    document.querySelector(".loading").remove()
    let array = response.list.results
    if(array.length == 0) {
        document.querySelector(".orderList").innerHTML = `
            <div class='loading' style="height: 100vh;display: grid;align-items: center;justify-content: center;font-size:25px;">
                !NO ORDERS
            </div>
        `
        return false
    }
    renderContent(array) 
})

function renderContent (data) {
    //getparent
    let parent = document.querySelector(".orderList")

    for(let x = 0; x < data.length; x++) {

        let childElement = document.createElement('div')
        childElement.innerHTML = 
        childElement.innerHTML = `<div class="flex rounded shadow p-3">
        <div class="w-1/4">${data[x].key}</div>
        <div class="w-1/4">${data[x].props.custonername}</div>
        <div class="w-1/4">${ data[x].props.listOfProducts.length }</div>
        <div class="w-1/4">
            <button class="bg-green-500 rounded text-white px-2">view</button>
        </div>
        </div> 
        `
        parent.appendChild(childElement)
    }
}

   