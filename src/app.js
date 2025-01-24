import express from "express"
import __dirname from "./utils.js"
//importar routers
import ProductManager from "./router/products.routes.js"
import cartsRoutes from "./router/carts.routes.js"

const productManager = new ProductManager()
const app = express()
//Iniciar server
app.listen(8080, () => {
    console.log("Servidor activo")
})
//Declarar middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//Declarar rutas
app.use("/products", productManager.createRoutes())
app.use("/carts", cartsRoutes)