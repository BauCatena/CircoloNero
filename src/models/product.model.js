import mongoose from "mongoose"

const {Schema} = mongoose

const product = new Schema ({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    stock: {type: Number, required: true},
})
const productModel = mongoose.model("product", product)

export default productModel