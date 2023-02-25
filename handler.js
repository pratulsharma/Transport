'use strict';
const {v4: uuid} = require('uuid');
const AWS = require('aws-sdk')
// import AWS, { OpenSearch } from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient();


module.exports.createDriver = async (event) => {
  const now = new Date();
  const driverId = uuid();
  console.log(event.body);
  const {driverName, driverMobile, driverDL, driverCar, driverAddress, carType } = JSON.parse(event.body)
  console.log(event.body);
const driver = {
  driverName,
   driverMobile, 
   driverEmail,
   driverDL, 
   driverCar, 
   driverAddress, 
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



 module.exports.createRide = async (event) => {
  const now = new Date();
  const rideId = uuid();
  const {fromCity, toCity, date_ride, time_ride, maxP, carType, price_ride, status_ride, driverMobile} = JSON.parse(event.body)
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
  const bookId = uuid();
  const {fromCity, toCity, date_ride, time_ride, maxP, carType, price_ride, status_ride, driverMobile, driverEmail} = JSON.parse(event.body)
const ride = {
  bookId,
  fromCity,
  toCity,
  date_ride,
  time_ride,
  maxP,
  carType,
  price_ride,
  status_ride,
  driverMobile,
  createdAt: now.toISOString()
}
try{
// Get the Driver Info
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

