const AWS = require("aws-sdk");
const uuidv4 = require("uuid/v4");

AWS.config.update({ region: "eu-west-1" });

function insertVideoStream(userId, videos) {
  const params = {
    TableName: process.env.videoStreamsTableName,
    Item: {
      userId,
      videos
    }
  };

  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  return dynamoDb.put(params).promise();
}

module.exports.fillUserVideoStreams = (userId, numberOfVideos) => {
  const videos = [];
  for (let i = 0; i < numberOfVideos; i += 1) {
    videos.push(uuidv4());
  }
  return insertVideoStream(userId, videos);
};
