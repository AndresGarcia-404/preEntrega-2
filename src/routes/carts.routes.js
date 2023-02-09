import { Router } from "express";
import { cartModel } from "../models/carts.model.js"
import { productModel } from "../models/products.model.js";

const router = Router();

router.get('/', async (req, res)=>{
    try {
        let carts = await cartModel.find();
        res.status(200).send(carts.length > 0 ? carts : {error: "No hay Carritos",carts:carts});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:id', async (req, res)=>{
    const {id} = req.params;
    try {
        const result = await cartModel.findById(id).populate('products.product');
        res.status(200).send(result);
    } catch (error) {
        res.status(404).send("Cart not found");
    }
});

router.post('/', async (req, res)=>{
    const newCart = {products:[]};
    try {
        const result = await cartModel.create(newCart);
        res.status(200).send({status:"succes",payload:result});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/:cid/product/:pid', async (req,res)=>{
    const {cid,pid} = req.params;
    try {
        
        const cart = await cartModel.findById(cid);
        if(!cart){
            res.status(404).send("Cart Not Found");
            return;
        }
        const backCart = cart.products;
        const product = await productModel.findById(pid);
        if(!product){
            res.status(404).send("Product Not Found");
            return;
        }
        const checkExist = backCart.findIndex((singlP) => singlP.product == pid);
        if (checkExist !== -1) {
            backCart[checkExist].quantity++;
            await cartModel.findByIdAndUpdate(cid,{products:backCart});
            res.status(200).send("added product");
        } else {
            cart.products.push({product:pid, quantity:1});
            let result = await cartModel.findByIdAndUpdate(cid,cart)
            console.log(result);
            res.status(200).send("added product");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        await cartModel.findByIdAndDelete(id)
        res.status(200).send("deleted")
    } catch (error) {
        res.status(404).send("Cart Not Found")
    }
})

export default router; 