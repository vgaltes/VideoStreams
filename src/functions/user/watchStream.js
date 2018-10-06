const AWS = require("aws-sdk");

function insertVideoStream(userId, videoId) {
  const params = {
    TableName: process.env.videoStreamsTableName,
    Item: {
      userId,
      videoId
    }
  };

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  return dynamoDb.put(params).promise();
}

module.exports.handler = async (event, context, callback) => {
  const params = {
    TableName: process.env.videoStreamsTableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.pathParameters.user_id
    }
  };

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const results = await dynamoDb.query(params).promise();

  if (results.Count === 3) {
    const response = {
      statusCode: 403,
      body: JSON.stringify({ message: "User watching too many video streams." })
    };
    callback(null, response);
  }

  const req = JSON.parse(event.body);

  await insertVideoStream(event.pathParameters.user_id, req.video_id);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      video_id: req.video_id
    })
  };
  callback(null, response);
};
