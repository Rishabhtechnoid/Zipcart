import { User } from "../models/users.js";
import { sendOtp } from "../utils/sendOtp.js";
import { verifyOtp } from "../utils/verifyOtp.js"; 
import { sendToken } from "../utils/sendToken.js";


export const generateOtp = async (req,res)=>{
    try {
        const { name, email,mobileNumber} = req.body;
    
        let user = await User.findOne({ mobileNumber });
    
        if (user) {
          return res
            .status(400)
            .json({ success: false, message: "Account Already Exists Please Login" });
        }

    
        user = await User.create({
          name,
          email,
          mobileNumber
        });
        
        sendOtp(mobileNumber);
    
        sendToken(
          res,
          user,
          201,
          "OTP sent to your mobile number please verify your account"
        );
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
};

export const verifyUser = async(req,res)=>{
    try {
        const otp = Number(req.body.otp);
        const mobileNumber = Number(req.body.mobileNumber);
    
        const user = await User.findById(req.user._id);
    

        if (verifyOtp(mobileNumber,otp)==false) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid OTP or has been Expired" });
        }
    
        user.verified = true;
    
    
        await user.save();
    
        sendToken(res, user, 200, "User Account Verified");
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
} 

export const login = async (req,res)=>{
    try {
        const { mobileNumber} = req.body;
    
        if (mobileNumber==null) {
          return res
            .status(400)
            .json({ success: false, message: "Please enter valid mobile number" });
        }
    
        const user = await User.findOne({ mobileNumber });
    
        if (!user) {
          return res
            .status(400)
            .json({ success: false, message: "It seems you doesn't have an account please Register first " });
        }
    
        sendOtp(mobileNumber);
        
        sendToken(res, user, 200, "OTP sent to your mobile number please verify");
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
};


export const logout = async (req,res)=>{
    try{
        res
        .status(200)
        .cookie ("token",null,{
        })
        .json({
            success : true,
            message : "Logout Sucessfully",
        })
    }catch(error){
        res
        .status(500)
        .json({
            success : false,
            message : error.message,
        })
    }

};

export const addAddress = async (req,res)=>{
    try{
        const {street,pincode,city,addressTitle} = req.body;
        
        const user = await User.findById(req.user._id);
          
        user.address.push({street,city,pincode,addressTitle});

        await user.save();
        res.status(200).json({
            success : true,
            message : "Address added sucessfully",
        });
       
    }catch(error){
        res
        .status(500)
        .json({
            success : false,
            message : error.message,
        })
    }

};

export const removeAddress = async (req,res)=>{
    try{
        const {addressId} = req.params;

        const user = await User.findById(req.user._id);
  
       user.address = user.address.filter(
        (add) => add._id.toString()  !== addressId.toString());

        await user.save();
        res.status(200).json({
            success : true,
            message : "Address deleted sucessfully",
        });
       
    }catch(error){
        res
        .status(500)
        .json({
            success : false,
            message : error.message,
        })
    }

};