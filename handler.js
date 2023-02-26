'use strict';
const {v4: uuid} = require('uuid');
const AWS = require('aws-sdk');
const stripe = require("stripe")("sk_test_yojwH4SOAP5pcBZLv53QtfpV")

// import AWS, { OpenSearch } from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient();


module.exports.createDriver = async (event) => {
  const now = new Date();
  const driverId = uuid();
  console.log(event.body);
  const {driverName, driverMobile,driverEmail, driverDL, driverCar, driverAddress, account_id, carType } = JSON.parse(event.body)
  console.log(event.body);
const driver = {
  driverName,
   driverMobile, 
   driverEmail,
   driverDL, 
   driverCar, 
   driverAddress, 
   account_id,
   carType,
  createdAt: now.toISOString()
}
try{
  await dynamodb.put({
    TableName:'driverTable',
    Item: driver
  }).promise().then((result)=>{
console.log("XXXXXXXX", result)
  });
}
catch(error){
  console.error(error)
}
  return {
    statusCode: 200,
    body: JSON.stringify(
       driver 
    ),
  };
};



module.exports.driverPaymentOnboarding = async (event) => {
  const now = new Date();
  const dponbId = uuid();
  console.log(event.body);
  //check if the driver exixts in the db - based on the mobile number
  //create stripe account 
  //create the account onboarding link 
  // prefill the link 
  // send the link to the driver to setup his account with the platform 
  const {driverMobile,driverEmail } = JSON.parse(event.body)
  console.log(event.body);
const driver = {
   driverMobile, 
   driverEmail,
  createdAt: now.toISOString()
}
try{

// Get the Driver Info
  const params = {
    TableName: 'driverTable',
    Key: { driverMobile},
    FilterExpression: "attribute_not_exists(account_id) or account_id = :null",
    ExpressionAttributeValues: {
              ':null': null

    },
  };

//  const driverAccountIdExists = await dynamodb.query(params).promise()

//  console.log("DRIVER ACCOUNT ID EXISTS?", driverAccountIdExists);
// check if the account_id for this driver already exists?
// if(driverAccountIdExists.account_id == 'null'){
// call stripe to create the account_id 
  console.log("Driver account ID does not exist")
  const account = await stripe.accounts.create({type: "express"});
  console.log("STRIPE ACCOUNT ID", account.id)
// save the account id in the driverTable 


// }


}
catch(error){
  console.error(error)
}
  return {
    statusCode: 200,
    body: JSON.stringify(
       driver 
    ),
  };
};


 module.exports.createRide = async (event) => {
  const now = new Date();
  const rideId = uuid();
  const {fromCity, toCity, date_ride, time_ride, maxP, carType, price_ride, status_ride, driverMobile, driverEmail} = JSON.parse(event.body)
const ride = {
  rideId,
  fromCity,
  toCity,
  date_ride,
  time_ride,
  maxP,
  carType,
  price_ride,
  status_ride,
  driverMobile,
  driverEmail,
  createdAt: now.toISOString()
}
try{
  await dynamodb.put({
    TableName:'ridesTable',
    Item: ride
  }).promise();
}
catch(error){
  console.error(error)
}
  return {
    statusCode: 200,
    body: JSON.stringify(
       ride 
    ),
  };
};

module.exports.bookRide = async (event) => {
  const now = new Date();
  const bookRideId = uuid();
  console.log("RESOLVE))))))))))))))))))))))))))))))))))))))))", event.body)
  const {fromCity, toCity, date_ride, time_ride, maxP, carType, price_ride,  driverMobile, driverEmail} = JSON.parse(event.body)
const bookRide = {
  bookRideId,
  fromCity,
  toCity,
  date_ride,
  time_ride,
  maxP,
  carType,
  price_ride,
  driverMobile,
  driverEmail,
  createdAt: now.toISOString()
}
try{
// Get the Driver Info
  const params = {
    TableName: 'driverTable',
    KeyConditionExpression: '#driverMobile = :driverMobile',
    ExpressionAttributeValues: {
      ':driverMobile': driverMobile,
    },
    ExpressionAttributeNames: {
      '#driverMobile': 'driverMobile',
    },
  };

 const driverExists = await dynamodb.query(params).promise()
 if(driverExists.Items != null){

  // so we got the driver information; we need to create the payment and send the 
  // checkout form to the FE 
  //
  await dynamodb.put(


  ).promise()
 }
}
catch(error){
  console.error(error)
}
  return {
    statusCode: 200,
    "message" : "it went fine"
  };
};


module.exports.updateRide = async (event) => {
  let rideId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(
        "Your ride with ride id " + rideId + " has been updated"
    ),
  };
};
module.exports.deleteRide = async (event) => {
  let rideId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(
        "Your ride with ride id " + rideId + " has been deleted"
    ),
  };
};


module.exports.getAllRides = async (event) => {
  const { fromCity, toCity } = event.queryStringParameters;
  console.log("--------------------------------------------------" )
  console.log("EVENTQPARAMATER",event.queryStringParameters )
  console.log("--------------------------------------------------" )
  const params = {
    TableName: 'ridesTable',
    KeyConditionExpression: '#fromCity = :fromCity AND  #toCity = :toCity',
    ExpressionAttributeValues: {
      ':fromCity': fromCity,
      ':toCity': toCity
    },
    ExpressionAttributeNames: {
      '#fromCity': 'fromCity',
      '#toCity': 'toCity',
    },
  };
  let rides;
  try{
  const result = await dynamodb.query(params).promise();
  rides = result.Items
  console.log(rides)
}
catch(error){
  console.error(error)
}
  return {
    statusCode: 200,
     body: JSON.stringify(rides),
  };
};

