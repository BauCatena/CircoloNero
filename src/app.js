import express from "express"
import mongoose from "mongoose"
import __dirname from "./utils.js"
import { engine } from "express-handlebars"
import bodyParser from "body-parser"

//importar routers
import productRouter from "./router/products.routes.js"
import cartRouter from "./router/carts.routes.js"
import viewsRouter from "./router/views.router.js"

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


//Declarar middleware
app.use(express.static(__dirname + "/public"))
app.engine("handlebars", engine())
app.set ("view engine", "handlebars") 
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))
//Declarar rutas

app.use("/view", viewsRouter)
app.use("/products", productRouter)
app.use("/carts", cartRouter)

