const socket = io()
let menuModal = document.getElementById("modalMenu")
let check = document.getElementById("check")

//DOM
const modal = document.getElementById("modifyModal")
const btnModal = document.getElementById("modify")
const closeBtn = document.getElementsByClassName("modify-close")[0]
const addForm = document.getElementById("createProductForm")
const modForm = document.getElementById("modifyProductForm")
const addProductBtn = document.getElementById("addProductButton")
const createProductForm = document.getElementById("createProductForm")
const modifyProductBtn = document.getElementById("modifyProductBtn")
const modifyProductContainer = document.getElementById("modifyProductForm")
const productId = document.getElementById("productId")
const deleteByIdBtn = document.getElementById("deleteByIdBtn")
const deleteForm = document.getElementById("deleteForm")
const deleteById = document.getElementById("deleteById")
//Variables
let firstclickAdd = false
let firstclickMod = false
let firstclickDel = false

btnModal.onclick = () => {
    modal.style.display = "block"
}

closeBtn.onclick = () => {
    modal.style.display = "none"
    createProductForm.style.display = "none"
    modifyProductContainer.style.display = "none"
    deleteForm.style.display = "none"
}

window.onclick = (e) => {
    if (e.target === modal || e.target === createProductForm) {
        modal.style.display = "none"
        createProductForm.style.display = "none"
        modifyProductContainer.style.display = "none"
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

addProductBtn.onclick = () => {
    if (!firstclickAdd){
        firstclickAdd = true
        firstclickDel = false
        firstclickMod = false
        modifyProductContainer.style.display = "none"
        createProductForm.style.display = "block"
        deleteForm.style.display = "none"
    }else{
        firstclickAdd = false
        createProductForm.style.display = "none"

    }
}
modifyProductBtn.onclick = () => {
    if(!firstclickMod){
        firstclickMod = true
        firstclickAdd = false
        firstclickDel = false
        createProductForm.style.display = "none"
        deleteForm.style.display = "none"
        modifyProductContainer.style.display = "block"
    }else{
        firstclickMod = false
        modifyProductContainer.style.display = "none"
    }
}
deleteByIdBtn.onclick = () => {
    if(!firstclickDel){
        firstclickDel = true
        firstclickAdd = false
        firstclickMod = false
        createProductForm.style.display = "none"
        modifyProductContainer.style.display = "none"
        deleteForm.style.display = "block"
    }else{
        firstclickDel = false
        deleteForm.style.display = "none"
    }
}

addForm.onsubmit = async (event) => {
    event.preventDefault() 
    
    const title = document.getElementById("title").value
    const price = document.getElementById("price").value
    const description = document.getElementById("description").value
    const stock = document.getElementById("stock")

    const productData = {
        title,
        price,
        description,
    }

    socket.emit("crearProducto", productData)
    
    socket.on("productoCreado", (data) => {
        console.log("Producto creado:", data.product);
        alert("Producto creado con éxito");
        form.reset(); // Limpiar el formulario
        modal.style.display = "none"; // Cerrar el modal
    });

    socket.on("error", (error) => {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
    });
    try {
        // Enviar los datos al servidor con fetch
        const response = await fetch("http://localhost:8080/products/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        })
        const data = await response.json()

        if (response.ok) {
            // Si el producto se crea con éxito, mostramos el mensaje
            console.log("Producto creado:", data.product)
            alert("Producto creado con éxito")
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
modifyProductContainer.onsubmit = async (event) => {
    event.preventDefault()

    try {
        const id = productId.value;
        fetch(`http://localhost:8080/products/products/${id}`)
        .then(response => response.json())

        const title = document.getElementById("titleMod").value
        const price = document.getElementById("priceMod").value
        const description = document.getElementById("descriptionMod").value
        const stock = document.getElementById("stockMod")
    
        const productData = {
            title,
            price,
            description,
            stock
        }
        fetch(`http://localhost:8080/products/products/${id}`, {
            method: "PUT", 
            headers: {
              "Content-Type": "application/json",  
            },
            body: JSON.stringify(productData), 
          })
          .then(response => response.json())
          socket.emit("productoModificado", productData)
          modifyProductContainer.reset()
    }
    catch (error) {
       console.error("Error al obtener producto, ", error)
    }

}
deleteForm.onsubmit = async (event) => {
    event.preventDefault()
    let ask = confirm("¿Desea borrar este producto? Esta acción es irreversible")
    if(ask){
        try {
            //buscar el producto con id
        const id = deleteById.value
        fetch(`http://localhost:8080/products/products/${id}`, {method: "DELETE"})
        .then(alert(`producto ${id} eliminado`))
        //Borrar el producto
        } catch (error) {
            console.log(error)
        }
        
    }else{
        let a = alert("No se ha borrrado ningún producto")
    }
}
console.log("soy el index y si funciono")