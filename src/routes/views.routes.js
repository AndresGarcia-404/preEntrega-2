import express from 'express';

const router = express.Router();

router.get('/products', (req, res) => {
    res.render("products",{title: "products", scriptJs: "./js/prods.js"})
})

router.get('/carts/:id', (req, res) => {
    res.render("prodincart")
})

router.get('/realTimeProducts', (req, res) => {
    res.render("realTimeProducts",{title: "realTime", scriptJs: "./js/index.js"})
})

export default router;