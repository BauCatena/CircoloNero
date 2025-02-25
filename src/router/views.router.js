import { Router } from "express"

const router = Router()

router.get("/products", (req, res) => {
    res.render("indexProduct", {
        style: "/css/style.css",
        script: "/js/product.js"
    })

})
router.get("/carts", (req, res) => {
    res.render("indexCarts", {
        style: "/css/style.css",
        script: "/js/carts.js"
    })
})
export default router