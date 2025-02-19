const socket = io()
async function getData() {
    try{
    const res = await fetch("http://localhost:8080/carts/cart")
    if(!res){
        console.log("error al enviar solicitud")
    }
    const data = await res.json()
    console.log(data)
    return data
    } catch(err){
    console.log(err)
    }
}
console.log("a programar perro")