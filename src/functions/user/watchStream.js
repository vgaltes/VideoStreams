const AWS = require("aws-sdk");

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

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      video_id: req.video_id
    })
  };
  callback(null, response);
};
