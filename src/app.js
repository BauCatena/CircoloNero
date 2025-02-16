import express from "express"
import __dirname from "./utils.js"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import bodyParser from "body-parser"
//importar routers

import ProductManager from "./router/products.routes.js"
import cartsRoutes from "./router/carts.routes.js"

const productManager = new ProductManager()
const app = express()
//Iniciar server
const httpServer = app.listen(8080, () => { console.log("Servidor activo en puerto 8080")})
//Activar socket
const socketserver = new Server(httpServer)


//Declarar middleware
app.use(express.static(__dirname + "/public"))
app.engine("handlebars", engine())
app.set("views", __dirname + "/views")
app.set ("view engine", "handlebars") 
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))
//Declarar rutas

app.use("/products", productManager.createRoutes())
app.use("/carts", cartsRoutes)

socketserver.on("connection", socket =>{
    console.log("Nuevo cliente conectado")
    socket.on('crearProducto', (data) => {
        socket.emit('productoCreado', { message: 'Producto procesado desde Socket.io', product: data });
    })
    socket.on("productoModificado", (id, data) =>{
        socket.emit("productoModificado", {message: "Producto procesado desde socket"})
    })
})