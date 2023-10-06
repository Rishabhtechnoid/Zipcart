
export const sendToken = (res,user,statusCode,message)=>{

   const token = user.getJWTToken();

   const userData={
    _id:user._id,
    name:user.name,
    email:user.email,
    verified:user.verified,
   }
    
   const options={
    httpOnly:true,
    expires:new Date(Date.now()+process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
   };
    
    res.status(statusCode)
    .cookie("token",token,options)
    .json({success:true,message,user:userData});


};