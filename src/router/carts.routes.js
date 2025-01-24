import {Router} from "express"
import __dirname from "../utils.js"
import fs from "fs"
import path from "path"

const cartsRoutes = Router()

class CartManager {
    constructor (){
        this.cartList = path.join(__dirname, "./data/carts.json")
    }
    //Métodos
    readCarts(){
        if (!fs.existsSync(this.cartList)){
            fs.writeFileSync(this.cartList, JSON.stringify([]))
        }
        const data = fs.readFileSync(this.cartList, "utf-8")
        return JSON.parse(data)
    }

    getCartById(id){
        const carts = this.readCarts()
        try{
            return carts.find(p => p.id === parseInt(id))
        }catch(err){
            return {error: "Carrito no encontrado"}
        }
    }

    getAllCarts(){
        return this.readCarts()
    }

    eraseCart(id){
        const carts = this.readCarts()
        const cartId = carts.findIndex(p => p.id === parseInt(id))

        if (cartId === -1){
            return {error: "No se encontró ningún carrito"}
        }
    }

    addCart(newCart){
        const carts = this.readCarts()
        const newId = carts.length > 0 ? maxHeaderSize.max(...carts.map(p => p.id)) +1 : 1
        newCart.id = newId
        carts.push(newCart)
        try{
            fs.writeFileSync(this.cartList, JSON.stringify(carts, null, 2), "utf-8")
            return {message: "Carrito creado", cart: newCart}
        }catch (err){
            return {error: "Error al crear carrito"}
        }
    }

    modifyCart(id, mod){
        this.id = id
        const carts = this.readCarts()
        const cartId = this.getCartById(this.id)

        carts[cartId] = { ...carts[cartId], ...modifiedCart}

        try{
            fs.writeFileSync(this.cartList, JSON.stringify(carts, null,2), "utf-8")
            return {message: "Carrito modificado", cart: carts[cartId]}
        }catch(err){
            return {error: "No se pudo modificar el carrito"}
        }
    }


    //Crear ruter para carritos
    createRoutes(){
        const router = Router()

        //Todos los carritos
        router.get("/carts", (req,res) =>{
            const carts = this.getAllCarts()
            res.json(carts)
        })
        //Buscar un carrito por ID
        router.get("/carts/:id", (req,res) =>{
            const cart = this.getCartById(req.params.id)
            res.status(cart ? 200 : 404).json(cart || {error: "Carrito no encontrado"})
        })
        //Crear un carrito
        router.post("/carts", (req,res) =>{
            const newCart = req.body
            const result = this.addCart(newCart)
            res.status(result.error ? 500 : 201).json(result)
        })
        //Eliminar un carrito
        router.delete("/carts/:id", (req,res) =>{
            const result = this.eraseCart(req.params.id)
            res.status(result.error ? 500 : 200).json(result)
        })
        //Modificar carrito por ID
        router.put("/carts/:id", (req,res) =>{
            const modifiedCart = req.body
            const result = this.modifyCart(req.params.id, modifiedCart)
            res.status(result.error ? 500 : 200),json(result)
        })
        return router
    }
}
export default cartsRoutes