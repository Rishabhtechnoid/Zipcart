import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
     name:{
        type : String,
        required : true,
     },
     email:{
        type : String,
        require : true,
        unique : true,
     },
     mobileNumber:{
        type: String,
        require : true,
     },
     dob:{
         type:Date,
         require:true,
     },
     address:[{
        street:"String",
        city:"String",
        pincode:Number,
        addressTitle:"String",
        
     }],
     verified:{
        type:Boolean,
        default:false,
     },
     createdAt:{
        type:Date,
        default:Date.now,
     },
     isDeliveryAgent:{
      type:Boolean,
      default:false
     }
});

userSchema.methods.getJWTToken = function (){
   return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
      expiresIn:process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
   
   });
   };
  
// userSchema.index({otpExpiry : 1 }, {expireAfterSeconds : 0});
export const User = mongoose.model("User",userSchema);