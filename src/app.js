import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import {Server} from 'socket.io'
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import session from 'express-session';
import initializePassport from './config/passport.config.js';
import productRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";
import cartRouter from "./routes/carts.routes.js";
import userRouter from "./routes/users.routes.js";
import sessionsRouter from "./routes/session.routes.js";
import {productModel} from "./models/products.model.js"
import { DB_NAME,DB_USER,DB_PASS,PORT } from './consts.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("Esto es un secreto"));
initializePassport(passport);
app.use(
    session({
      secret: "coderhouse",
      resave: true,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: `mongodb+srv://${DB_USER}:${DB_PASS}@codercluster.u9omn6q.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
        mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        ttl: 30,
      }),
    })
  );
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views","./src/views");
app.use(express.static("public"));

app.use("/api/products",productRouter);
app.use("/api/carts",cartRouter);
app.use("/api/users",userRouter);
app.use("/api/sessions",sessionsRouter)
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