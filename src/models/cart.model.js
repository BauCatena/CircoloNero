import mongoose from "mongoose"

const {Schema} = mongoose

const cart = new Schema ({
    title: {type: String, required: true},
    owner: {type: String, required: true},
    productsAdded: {type: String, required: true},
})
const CartModel = mongoose.model("cart", cart)

export default CartModel