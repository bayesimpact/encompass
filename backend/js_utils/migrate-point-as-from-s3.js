/**
 * Basic utility script to get Point-A data from S3 and then write the records to the specified
 * DynamoDB table. This script will add a v1 UUID to each record to use as the index in DynamoDB.
 *
 * This script naturally has a lot of overlap with the Service Areas script.
 * TODO: extract or combine ETL scripts as data model is defined.
 */

const AWS = require("aws-sdk");
AWS.config.update({region: 'us-west-1'});
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid/v1");

// If we want to use a similar script during e.g. deploy, we should make these to be arguments.
// Parameters for S3.
const bucketName = "network-adequacy";
const objectKey = "eddm_data.json";
// Parameters for DB.
const tableName = "network-adequacy-test";


// Grab the data from the json file.
let params = {
  Bucket: bucketName,
  Key: objectKey
};
let pointAsPromise = s3.getObject(params).promise();

// Process the data.
pointAsPromise.then(function(data) {
  const records = JSON.parse(data.Body);
  for(let record of records) {
    putItem(record);
  }
}).catch(function(err) {
  console.error("Error retrieving data from S3: " + err);
});


/**
 * Add record to DB
 */
function putItem(item){
  item.id = uuid(); // Add ID.

  const params = {
    Item: item,
    TableName: tableName
  };
  let putOperationPromise = dynamodb.put(params).promise();
  putOperationPromise.then(function(result){
    // Write succeeded.
    console.log("Record written to DB.");
  }).catch(function(err){
    console.error("Error putting object in DB: " + err);
  });

}
