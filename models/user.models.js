import mongoose from "mongoose";

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
            required:true,
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

const User = mongoose.model("user" , userSchema);

export default User;