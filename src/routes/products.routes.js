import { Router } from "express";
import {productModel} from "../models/products.model.js"

const router = Router();

router.get('/', async (req,res) => {
    try {
        const limit = parseInt(req.query.limit,10) || 10;
        const page = parseInt(req.query.page,10) || 1;
        const category = req.query.category;
        const status = req.query.status;
        const sort = req.query.sort;
        let linkhelp = ''
        let queryHelp;
        let sortHelp;
        let result;

        if(category && status){
            queryHelp = {category: category, status: status};
            linkhelp += `&category=${category}&status=${status}`
        } else if (category) {
            queryHelp = {category: category};
            linkhelp += `&category=${category}`
        } else if(status) {
            queryHelp = {status: status};
            linkhelp += `&status=${status}`
        } else {
            queryHelp = {};
        }

        if (sort == 'asc'){
            sortHelp = 1;
            linkhelp += `&sort=asc`
        } else if (sort == 'desc'){
            sortHelp = -1;
            linkhelp += `&sort=desc`
        } 

        if (sortHelp) {
            const products = await productModel.paginate(queryHelp,{limit, page,sort: { price: sortHelp }})
            result = {status:"succes",payload:products}
        } else{
            const products = await productModel.paginate(queryHelp,{limit, page})
            result = {status:"succes",payload:products}
        }

        if(result.payload.hasNextPage == true){
            result.payload.nextLink = `http://localhost:8080/api/products?page=${page+1}${linkhelp}`
        }
        if(result.payload.hasPrevPage == true){
            result.payload.prevLink = `http://localhost:8080/api/products?page=${page-1}${linkhelp}`
        }

        res.status(200).send(result)


    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const result = await productModel.findById(id);
        res.status(200).send(result);
    } catch (error) {
        res.status(404).send("product not found")
    }
})

router.post('/',async (req, res) => {
    const {title,description,code,price,status,stock,category,thumbnail} = req.body;
    const newProduct = {title,description,code,price,status,stock,category,thumbnail}
    try {
        const result = await productModel.create(newProduct);
        res.status(200).send({status:"succes",payload:result})
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const result = await productModel.findByIdAndUpdate(id,req.body)
        res.status(200).send({status:"success",payload:result})
    } catch (error) {
        res.status(404).send("Product not found")
    }
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        await productModel.findByIdAndDelete(id)
        res.status(200).send("Product deleted")
    } catch (error) {
        res.status(404).send("Product not found")
    }
})

export default router;