import express from 'express';
import { productModel } from '../models/products.model.js';
import { cartModel } from '../models/carts.model.js';

const router = express.Router();

router.get('/products/:page', async (req, res) => {
    let perpage = 5;
    let page = req.params.page || 1;
    let pagesNumberInd = [];
    let nameSession = "";
    let emailSession = "";
    let rol = "Usuario";
    let logged = false;

    if (req.user){
        logged = true;
        nameSession = req.user.first_name
        emailSession = req.user.email
        if(req.user.email == "adminCoder@coder.com"){rol = "Admin"}
    }


    productModel.find().lean().skip((perpage * page)-perpage).limit(perpage).exec((err , products) => {
        productModel.count((err,count) =>{
            if(err) return next(err);    
            let pagesCount = Math.ceil(count/perpage)
            for (let i = 1; i <= pagesCount; i++) {
                pagesNumberInd.push({pagina: i});
            }
            res.render("products",{title: "products",scriptJs: "../js/users.js",productos:products,current:page,pages: pagesCount,paginaInd:pagesNumberInd,name: nameSession,email: emailSession,rol: rol,logStatus: logged});
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

router.get('/', (req, res) => {
    res.redirect("/api/users/signin")
});

router.get('/realTimeProducts', (req, res) => {
    res.render("realTimeProducts",{title: "realTime", scriptJs: "./js/index.js"})
})

export default router;