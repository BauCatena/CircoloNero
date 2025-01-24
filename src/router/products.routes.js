import fs from "fs"
import path from "path"
import __dirname from "../utils.js"
import { Router } from "express"

class ProductManager {
  constructor() {
    this.productsList = path.join(__dirname, "./data/products.json")
  }
  // Método para leer los productos del archivo
  readProducts() {
    if (!fs.existsSync(this.productsList)) {
      fs.writeFileSync(this.productsList, JSON.stringify([]))
    }
    const data = fs.readFileSync(this.productsList, "utf-8")
    return JSON.parse(data)
  }
  // Método para obtener todos los productos
  getAllProducts() {
    return this.readProducts()
  }
  // Método para obtener un producto por su ID
  getProductById(id) {
    const products = this.readProducts()
    return products.find(p => p.id === parseInt(id))
  }
  // Método para agregar un nuevo producto
  addProduct(newProduct) {
    const products = this.readProducts()
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
    newProduct.id = newId
    products.push(newProduct)

    try {
      fs.writeFileSync(this.productsList, JSON.stringify(products, null, 2), "utf8")
      return { message: "Producto agregado", product: newProduct }
    } catch (err) {
      return { error: "Error al guardar el producto" }
    }
  }
  // Método para eliminar un producto por ID
  deleteProduct(id) {
    const products = this.readProducts()
    const productIndex = products.findIndex(p => p.id === parseInt(id))

    if (productIndex === -1) {
      return { error: "Producto no encontrado" }
    }

    products.splice(productIndex, 1) // Eliminar el producto del array

    try {
      fs.writeFileSync(this.productsList, JSON.stringify(products, null, 2), "utf8")
      return { message: "Producto eliminado" }
    } catch (err) {
      return { error: "Error al eliminar el producto" }
    }
  }
  // Método para actualizar un producto por ID
  updateProduct(id, updatedProduct) {
    const products = this.readProducts()
    const productIndex = products.findIndex(p => p.id === parseInt(id))

    if (productIndex === -1) {
      return { error: "Producto no encontrado" }
    }

    // Actualizar el producto con los nuevos datos
    products[productIndex] = { ...products[productIndex], ...updatedProduct }

    try {
      fs.writeFileSync(this.productsList, JSON.stringify(products, null, 2), "utf8")
      return { message: "Producto actualizado", product: products[productIndex] }
    } catch (err) {
      return { error: "Error al actualizar el producto" }
    }
  }
  // Crear el router para las rutas de productos
  createRoutes() {
    const router = Router()
    // Ruta para obtener todos los productos
    router.get("/products", (req, res) => {
      const products = this.getAllProducts()
      res.json(products)
    })
    // Ruta para obtener un producto por ID
    router.get("/products/:id", (req, res) => {
      const product = this.getProductById(req.params.id)
      res.status(product ? 200 : 404).json(product || { error: "Producto no encontrado" })
    })
    // Ruta para agregar un nuevo producto
    router.post("/products", (req, res) => {
      const newProduct = req.body
      const result = this.addProduct(newProduct)
      res.status(result.error ? 500 : 201).json(result)
    })
    // Ruta para eliminar un producto por ID
    router.delete("/products/:id", (req, res) => {
      const result = this.deleteProduct(req.params.id)
      res.status(result.error ? 500 : 200).json(result)
    })
    // Ruta para actualizar un producto por ID
    router.put("/products/:id", (req, res) => {
      const updatedProduct = req.body
      const result = this.updateProduct(req.params.id, updatedProduct)
      res.status(result.error ? 500 : 200).json(result)
    })
    return router
  }
}
export default ProductManager