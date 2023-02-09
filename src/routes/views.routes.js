import express from 'express';
import { productModel } from '../models/products.model.js';
import { cartModel } from '../models/carts.model.js';

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

//productos cid
router.get('/carts/:cid', async (req, res) => {
    const {cid} = req.params;
    let prods = await cartModel.findById(cid).populate('products.product').lean();
    console.log(prods.products);
    res.render("prodincart",{title:"cart", cid:cid,productos:prods.products})
})

router.get('/realTimeProducts', (req, res) => {
    res.render("realTimeProducts",{title: "realTime", scriptJs: "./js/index.js"})
})

export default router;