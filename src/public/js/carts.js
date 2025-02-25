let menuModal = document.getElementById("modalMenu")
let check = document.getElementById("check")
//DOM
const cartsList = document.getElementById("cartsList")
const modal = document.getElementById("modifyModal")
const btnModal = document.getElementById("modify")
const closeBtn = document.getElementsByClassName("modify-close")[0]
const addForm = document.getElementById("addCartForm")
const modForm = document.getElementById("modifyCartForm")
const addCartBtn = document.getElementById("addCartButton")
const modifyCartBtn = document.getElementById("modifyCartBtn")
const modifyCartContainer = document.getElementById("modifyCartForm")
const cartId = document.getElementById("cartId")
const deleteByIdBtn = document.getElementById("deleteByIdBtn")
const deleteForm = document.getElementById("deleteForm")
const deleteById = document.getElementById("deleteById")
//Variables
let firstclickAdd = false
let firstclickMod = false
let firstclickDel = false

let items = async () => {
    const response = await fetch("http://localhost:8080/carts")

    .then(response => response.json())
    .then(data =>{
        data.carts.forEach(item => {
        const id = item._id;
        const title = item.title;
        const owner = item.owner;
        const productsAdded = item.productsAdded;
        let titleli = document.createElement("li")
        let titleP = document.createElement("p")
        titleP.textContent = ("Nombre del carrito: "+ title)
        
        titleli.appendChild(titleP)
        cartsList.appendChild(titleli) 
        
        const idli = document.createElement("li")
        const idP = document.createElement("p")
        idP.textContent = ("ID: "+ id)
        
        idli.appendChild(idP)
        cartsList.appendChild(idli)

        const ownerli = document.createElement("li")
        const ownerP = document.createElement("p")
        ownerP.textContent = ("Dueño del carrito: "+ owner)
        
        ownerli.appendChild(ownerP)
        cartsList.appendChild(ownerli)

        const productsAddedli = document.createElement("li")
        const productsAddedP = document.createElement("p")
        productsAddedP.textContent = ("Productos: "+ productsAdded)
        
        productsAddedli.appendChild(productsAddedP)
        cartsList.appendChild(productsAddedli)
        let br = document.createElement("br")
        cartsList.appendChild(br)
        })
        
    })
    .catch (error =>{
        console.error(error)
    })
}
items()
btnModal.onclick = () => {
    modal.style.display = "block"
}

closeBtn.onclick = () => {
    modal.style.display = "none"
    addForm.style.display = "none"
    modifyCartContainer.style.display = "none"
    deleteForm.style.display = "none"
}

window.onclick = (e) => {
    if (e.target === modal || e.target === addForm) {
        modal.style.display = "none"
        addForm.style.display = "none"
        modifyCartContainer.style.display = "none"
        deleteForm.style.display = "none"
    }
}
check.addEventListener("change", (e) => {
    if (check.checked) {
        menuModal.classList.toggle("active")
    }else {
        menuModal.classList.toggle("active")
    }
})

addCartBtn.onclick = () => {
    if (!firstclickAdd){
        firstclickAdd = true
        firstclickDel = false
        firstclickMod = false
        modifyCartContainer.style.display = "none"
        addForm.style.display = "block"
        deleteForm.style.display = "none"
    }else{
        firstclickAdd = false
        addForm.style.display = "none"

    }
}
modifyCartBtn.onclick = () => {
    if(!firstclickMod){
        firstclickMod = true
        firstclickAdd = false
        firstclickDel = false
        addForm.style.display = "none"
        deleteForm.style.display = "none"
        modifyCartContainer.style.display = "block"
    }else{
        firstclickMod = false
        modifyCartContainer.style.display = "none"
    }
}
deleteByIdBtn.onclick = () => {
    if(!firstclickDel){
        firstclickDel = true
        firstclickAdd = false
        firstclickMod = false
        addForm.style.display = "none"
        modifyCartContainer.style.display = "none"
        deleteForm.style.display = "block"
    }else{
        firstclickDel = false
        deleteForm.style.display = "none"
    }
}

addForm.onsubmit = async (event) => {
    event.preventDefault() 
    
    const title = document.getElementById("title").value
    const owner = document.getElementById("owner").value
    const productsAdded = document.getElementById("productsAdded").value

    const cartData = {
        title,
        owner,
        productsAdded
    }
        addForm.reset();
        modal.style.display = "none"
    try {
        // Enviar los datos al servidor con fetch
        const response = await fetch("http://localhost:8080/carts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cartData),
        })
        const data = await response.json()

        if (response.ok) {
            // Si el producto se crea con éxito, mostramos el mensaje
            console.log("Carrito agregado:", cartData)
            alert("Carrito agregado exitosamente")
        } else {
            // Si hubo un error, mostramos el error
            console.error("Error:", data.error)
            alert(`Error: ${data.error}`)
        }
    } catch (error) {
        console.error("Error al enviar los datos:", error)
        alert("Hubo un problema al enviar el formulario")
    }
    addForm.reset()
    modal.style.display = "none"
}
modifyCartContainer.onsubmit = async (event) => {
    event.preventDefault()

    try {
        const id = cartId.value;
        fetch(`http://localhost:8080/carts/${id}`)
        .then(response => response.json())

        const title = document.getElementById("titleMod").value
        const owner = document.getElementById("ownerMod").value
        const productsAdded = document.getElementById("productsAdded")
    
        const cartData = {
            title,
            owner,
            productsAdded
        }
        fetch(`http://localhost:8080/carts/${id}`, {
            method: "PUT", 
            headers: {
              "Content-Type": "application/json",  
            },
            body: JSON.stringify(cartData), 
          })
          .then(response => response.json())
          modifyCartContainer.reset()
    }
    catch (error) {
       console.error("Error al obtener carrito, ", error)
    }

}
deleteForm.onsubmit = async (event) => {
    event.preventDefault()
    let ask = confirm("¿Desea borrar este carrito? Esta acción es irreversible")
    if(ask){
        try {
            //buscar el carrito con id
        const id = deleteById.value
        fetch(`http://localhost:8080/carts/${id}`, {method: "DELETE"})
        .then(alert(`carrito ${id} eliminado`))
        } catch (error) {
            console.log(error)
        }
        
    }else{
        let a = alert("solicitud cancelada")
    }
}