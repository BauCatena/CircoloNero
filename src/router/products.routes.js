import { Router } from "express"
import ProductModel from "../models/product.model.js"

const router = Router()

//Read
router.get("/", async (req, res) => {
  try{
      const products = await ProductModel.find()
      res.send({products: products.map( product => product.toObject())})
  }catch(error){
      res.send({error:"Error al obtener productos"})
      console.error(error)
  }
})

//Leer un producto específico
router.get("/:id", async (req, res) => {
  try{
      const aProduct = await ProductModel.findById(req.params.id)
      if(!aProduct){
          return res.send({error: "Producto no encontrado"})
      }
      res.send({product: aProduct.toObject()})
  }catch(error){
      res.send({error:"Error al obtener producto"})
      console.error(error)
  }
})

//Create
router.post("/", async (req, res) => {
    try{
        const newProduct = new ProductModel(req.body)
        await newProduct.save()

        res.send({product: newProduct.toObject()})
    }catch(error){
        res.send({error: "Error al agregar el producto"})
        console.error(error)
    }
})
//update
router.put("/:id", async (req, res) => {
    const { id } = req.params 
    const updatedData = req.body 

    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            updatedData, 
            { new: true } 
        )

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" })
        }


        res.status(200).json(updatedProduct)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error al actualizar el producto", error })
    }
})

//Delete
router.delete("/:id", async (req, res) => {
    try{
        const productToDelete = await ProductModel.findByIdAndDelete(req.params.id)
        if(!productToDelete){
            return res.send({error: "Producto no encontrado"})
        }
    }catch(error){
        res.send({error:"Error al eliminar el producto"})
        console.error(error)
    }
})

export default router