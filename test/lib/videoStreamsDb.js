const AWS = require("aws-sdk");
const uuidv4 = require("uuid/v4");

AWS.config.update({ region: "eu-west-1" });

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

module.exports.fillUserVideoStreams = (userId, numberOfVideos) => {
  const inserts = [];
  for (let i = 0; i < numberOfVideos; i += 1) {
    inserts.push(insertVideoStream(userId, uuidv4()));
  }
  return Promise.all(inserts);
};
