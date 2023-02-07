import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from "dotenv";
import { engine } from 'express-handlebars';
import {Server} from 'socket.io'
import productRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";
import {productModel} from "./models/products.model.js"


dotenv.config()

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views","./src/views");
app.use(express.static("public"));

app.use("/api/products",productRouter);
app.use("/",viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`iniciando en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

const enviroment = async() => {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@codercluster.u9omn6q.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`) 
    console.log("DB connection established");
}
enviroment();

app.get("/prodHelp", async (req, res) => {
    try {
        const prods = await productModel.find();
        res.json(prods)
    } catch (error) {
        res.status(500).send(error)
    }
})

socketServer.on("connection", async (socket) =>{
    socket.on("new-product",async (data)=>{
        try {
            const newProd = await productModel.create(data);
            const products = await productModel.find();
            socketServer.emit("addProduct",products);
        } catch (error) {
            throw error;
        }
    })
    socket.on("delete-product", async (data)=>{
        try {
            let idEliminar = data.idELim;
            await productModel.findByIdAndDelete(idEliminar)
            const products = await productModel.find();
            socketServer.emit("addProduct",products);
        } catch (error) {
            throw error;
        }
    })
})