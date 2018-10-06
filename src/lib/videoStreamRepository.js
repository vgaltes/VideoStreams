const AWS = require("aws-sdk");

module.exports.insertVideoStream = (userId, videoId, tableName) => {
  const params = {
    TableName: tableName,
    Item: {
      userId,
      videoId
    }
  };

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  return dynamoDb.put(params).promise();
};

module.exports.getVideoStreamsFromUser = async (userId, tableName) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  };

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const results = await dynamoDb.query(params).promise();
  return results;
};
