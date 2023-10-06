import AWS from 'aws-sdk';
import crypto from 'crypto';
export const sendOtp =  (mobileNumber) => {
 
    
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
    
    console.log("At the end of ref id function");
    return md5Hash.digest('hex');
}

  

// Initialize AWS Pinpoint
const pinpoint = new AWS.Pinpoint();


console.log("Initialized AWS Pinpoint");

const num = Number(process.env.ORIGINATION_IDENTITY);
console.log("Params : codelength :-"+ process.env.CODELENGTH + "origination identity :- "+ num);

var params = {
ApplicationId: process.env.APPLICATION_ID, 
SendOTPMessageRequestParameters: { 
  BrandName: process.env.BRANDNAME,  
  Channel: process.env.CHANNEL, 
  DestinationIdentity: mobileNumber, 
  OriginationIdentity: '919111818196', 
  ReferenceId: generateRefId(mobileNumber), 
  AllowedAttempts: process.env.ALLOWDATTEMPTS,
  CodeLength: 6,
  EntityId: process.env.ENTITYID,
  Language: process.env.LANGUAGE,
  TemplateId: process.env.TEMPLATEID,
  ValidityPeriod: process.env.VALIDITYPERIOD
}
}

pinpoint.sendOTPMessage(params, function(err, data) {
if (err) console.log(err, err.stack); // an error occurred
else     console.log(data.MessageResponse.Result);           // successful response
});
    
    
}