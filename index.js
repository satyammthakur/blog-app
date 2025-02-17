import express from "express";
import path from "path";
import 'dotenv/config';
import { connectToMongoDB } from "./connect.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.routes.js";
import blogRoute from "./routes/blog.routes.js";
import { checkForAuthenticationCookie } from "./middlewares/auth.middleware.js";
import Blog from "./models/blog.models.js";
const app = express();
const PORT = 8000;

app.set("view engine" ,"ejs");
app.set("views" , path.resolve("./views"))

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

app.get('/' , async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render('home' ,{
        user:req.user,
        blogs: allBlogs,
    });
})
app.use("/user" , userRoute);
app.use("/blog" , blogRoute);
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
