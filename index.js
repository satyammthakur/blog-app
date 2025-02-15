import express from "express";
import path from "path";
import 'dotenv/config';
import { connectToMongoDB } from "./connect.js";

import userRoute from "./routes/user.routes.js";

const app = express();
const PORT = 8000;

app.set("view engine" ,"ejs");
app.set("views" , path.resolve("./views"))

app.use(express.urlencoded({extended:true}));

app.get('/' , (req,res)=>{
    res.render('home');
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
