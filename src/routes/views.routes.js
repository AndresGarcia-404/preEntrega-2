import express from 'express';
import { productModel } from '../models/products.model.js';

const router = express.Router();

router.get('/products/:page', async (req, res) => {
    let perpage = 3;
    let page = req.params.page || 1;
    productModel.find().lean().skip((perpage * page)-perpage).limit(perpage).exec((err , products) => {
        productModel.count((err,count) =>{
            if(err) return next(err);    
            let pagesCount = Math.ceil(count/perpage)
            res.render("products",{title: "products",productos:products,current:page,pages: pagesCount});
        })
    })
})

router.get('/carts/:id', (req, res) => {
    res.render("prodincart")
})

router.get('/realTimeProducts', (req, res) => {
    res.render("realTimeProducts",{title: "realTime", scriptJs: "./js/index.js"})
})

export default router;