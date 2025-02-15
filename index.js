import express from "express";
import path from "path";
import 'dotenv/config';
import { connectToMongoDB } from "./connect.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.routes.js";
import { checkForAuthenticationCookie } from "./middlewares/auth.middleware.js";

const app = express();
const PORT = 8000;

app.set("view engine" ,"ejs");
app.set("views" , path.resolve("./views"))

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get('/' , (req,res)=>{
    res.render('home' ,{
        user:req.user,
    });
})
app.use("/user" , userRoute);
connectToMongoDB(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.r5pa8.mongodb.net/${process.env.MONGO_DBNAME}retryWrites=true&w=majority`)
.then(()=>{
    console.log("connected to the db");
    app.listen(PORT , ()=>{
        console.log(`server started on the port: ${PORT} `);
    })
})
.catch((error) => {
    console.log("Connection failed");
    console.error("Error details:", error.message);
});
