import AWS from 'aws-sdk';
import crypto from 'crypto';

export const verifyOtp =  (mobileNumber,otp) => {
 
    
// Set your AWS credentials and region
AWS.config.update({
  accessKeyId: process.env.ACCESSKEY_ID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: process.env.REGION,
});


function generateRefId(mobileNumber) {
  const refId = process.env.BRANDNAME  + mobileNumber;
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(refId);
  return md5Hash.digest('hex');
}

// Initialize AWS Pinpoint
const pinpoint = new AWS.Pinpoint();

var params = {
    ApplicationId: process.env.APPLICATION_ID, 
    VerifyOTPMessageRequestParameters: { 
      DestinationIdentity:mobileNumber.toString(), 
      Otp:otp.toString(), 
      ReferenceId: generateRefId(mobileNumber) 
    }
  };
  pinpoint.verifyOTPMessage(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     
    {  console.log(data);    
       return data;
    }
  });

    
}