'use strict';
const {v4: uuid} = require('uuid');
const AWS = require('aws-sdk')
// import AWS, { OpenSearch } from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient();
 module.exports.createRide = async (event) => {
  const now = new Date();
  const rideId = uuid();
  const rideBody = JSON.parse(event.body)
const ride = {
  rideId,
  rideBody,
  // from: 'Rishikesh',
  // to: 'Delhi',
  // day: '3/24/2023',
  // time: '8:00am',
  // maxP: 5,
  // carType: 'Toyota Sienna',
  // price: 'Rs 4500',
  // status: 'Open',
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
  let rides;
  try{
  const rides = await dynamodb.scan({
    TableName:'ridesTable',

  }).promise();
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

