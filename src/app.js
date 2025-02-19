import express from "express"
import mongoose from "mongoose"
import __dirname from "./utils.js"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import bodyParser from "body-parser"
//importar routers

import ProductManager from "./router/products.routes.js"
const productManager = new ProductManager()

import CartManager from "./router/carts.routes.js"
const cartManager = new CartManager()

import dotenv from "dotenv"
dotenv.config()

const URIMongoDB = process.env.URIMONGO

const app = express()

mongoose.connect(URIMongoDB)
    .then( () => console.log("Conexión a base de datos exitosa"))
    .catch( (error) => {
        console.error("Error en conexión: ", error)
        process.exit()
    })
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
app.use("/carts", cartManager.createRoutes())

socketserver.on("connection", socket =>{
    console.log("Nuevo cliente conectado")
    socket.on("crearProducto", (data) => {
        socket.emit("productoCreado", { message: "Producto procesado desde Socket.io", product: data });
    })
    socket.on("productoModificado", (id, data) =>{
        socket.emit("productoModificado", {message: "Producto procesado desde socket"})
    })
})