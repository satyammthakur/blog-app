import mongoose from "mongoose";
import {createHmac , randomBytes} from "crypto" ; 
import { createTokenForUser } from "../services/auth.service.js";
const userSchema = new mongoose.Schema({
        fullName :{
            type: String,
            required: true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        salt:{
            type:String,
            // required:true,
        },
        password:{
            type:String,
            required:true,
            unique:true,
        },
        profileImageURL:{
            type:String,
            default: '/images/avatar.png',
        },
        role:{
            type:String,
            enum : ["USER" ,"ADMIN"],
            default: "USER",
        },
    }
    ,{timestamps:true}
);

userSchema.static('matchPasswordAndGenerateToken' , async function(email,password){
    const user = await this.findOne({email});

    if(!user) throw new Error("user not found");
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256" , salt)
        .update(password)
        .digest("hex");

    if(userProvidedHash !== hashedPassword){
        throw new Error("incprrect password");
    };
    const token = createTokenForUser(user);
    return token;
})

userSchema.pre('save' , function (next){
    const user = this; // this shouldn't be used with arrwo fucntions
    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256' , salt)
                            .update(user.password)
                            .digest("hex");
        this.salt = salt ;
        this.password = hashedPassword;

        next();

})

const User = mongoose.model("user" , userSchema);

export default User;