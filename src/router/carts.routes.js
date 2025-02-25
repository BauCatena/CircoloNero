import { Router } from "express"
import CartModel from "../models/cart.model.js"

const router = Router()

//Read
router.get("/", async (req, res) => {
  try{
      const carts = await CartModel.find()
      res.send({carts: carts.map( cart => cart.toObject())})
  }catch(error){
      res.send({error:"Error al obtener carritos"})
  }
})

//Leer un carrito específico
router.get("/:id", async (req, res) => {
  try{
      const aCart = await CartModel.findById(req.params.id)
      if(!aCart){
          return res.send({error: "carrito no encontrado"})
      }
      res.send({cart: aCart.toObject()})
  }catch(error){
      res.send({error:"Error al obtener carrito"})
  }
})

//Create
router.post("/", async (req, res) => {
    try{
        const newCart = new CartModel(req.body)
        await newCart.save()

        res.send({cart: newCart.toObject()})
    }catch(error){
        res.status(500).send({error: "Error al agregar el carrito"})
        console.error(error)
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params 
    const updatedData = req.body

    try {
        const updatedCart = await CartModel.findByIdAndUpdate(
            id, 
            updatedData,
            { new: true } 
        )
        if (!updatedCart) {
            return res.status(404).json({ message: "Carrito no encontrado" })
        }

        res.status(200).json(updatedCart)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error al actualizar el carrito", error })
    }
})

//Delete
router.delete("/:id", async (req, res) => {
    try{
        const cartToDelete = await CartModel.findByIdAndDelete(req.params.id)
        if(!cartToDelete){
            return res.send({error: "carrito no encontrado"})
        }
    }catch(error){
        res.send({error:"Error al eliminar carrito"})
    }
})

export default router