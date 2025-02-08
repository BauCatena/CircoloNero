const socket = io()
let menuModal = document.getElementById("modalMenu")
let check = document.getElementById("check")


const modal = document.getElementById("modifyModal")
const btnModal = document.getElementById("modify")
const closeBtn = document.getElementsByClassName("modify-close")[0]
const form = document.getElementById("createProductForm")
const addProductBtn = document.getElementById("addProductButton")
const createProductForm = document.getElementById("createProductForm")
const modifyProductBtn = document.getElementById("modifyProductBtn")
const modifyProductContainer = document.getElementById("modifyProductContainer")

let firstclickAdd = false
let firstclickMod = true

btnModal.onclick = () => {
    modal.style.display = "block"
}

closeBtn.onclick = () => {
    modal.style.display = "none"
    createProductForm.style.display = "none"
    //modifyProductContainer.style.display = "none"
}

window.onclick = (e) => {
    if (e.target === modal || e.target === createProductForm) {
        modal.style.display = "none"
        createProductForm.style.display = "none"
       // modifyProductContainer.style.display = "none"
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
       // modifyProductContainer.style.display = "none"
        createProductForm.style.display = "block"
    }else{
        firstclickAdd = false
        //createProductForm.style.display = "none"
    }
}
modifyProductBtn,onclick = () => {
    if(!firstclickMod){
        firstclickMod = true
        createProductForm.style.display = "none"
        //modifyProductContainer.style.display = "block"
    }else{
        firstclickMod = false
        //modifyProductContainer.style.display = "none"
    }
}

form.onsubmit = async (event) => {
    event.preventDefault() 
    
    const title = document.getElementById("title").value
    const price = document.getElementById("price").value
    const description = document.getElementById("description").value
    const stock = document.getElementById("stock")
   
    console.log("Producto creado:", {
        name: title,
        price: price,
        description: description,
        stock: stock
    })

    const productData = {
        title,
        price,
        description,
    }

    socket.emit('crearProducto', productData)
    
    socket.on('productoCreado', (data) => {
        console.log('Producto creado:', data.product);
        alert('Producto creado con éxito');
        form.reset(); // Limpiar el formulario
        modal.style.display = 'none'; // Cerrar el modal
    });

    socket.on('error', (error) => {
        console.error('Error:', error.message);
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
    form.reset()
    modal.style.display = "none"
}
console.log("soy el index y si funciono")