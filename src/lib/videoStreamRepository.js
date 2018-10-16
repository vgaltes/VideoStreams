const AWS = require("aws-sdk");

async function getUserVideos(tableName, userId, docClient) {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  };

  const results = await docClient.query(params).promise();
  if (results.Count === 0) return [];
  return results.Items[0].videos ? results.Items[0].videos.values : [];
}

function updateUserVideos(tableName, userId, videoId, docClient) {
  const params = {
    TableName: tableName,
    Key: { userId },
    UpdateExpression: "ADD videos :v",
    ExpressionAttributeValues: {
      ":v": docClient.createSet([videoId]),
      ":maxVideos": 3
    },
    ConditionExpression: "size(videos) < :maxVideos",
    ReturnValues: "UPDATED_NEW"
  };
  return docClient
    .update(params)
    .promise()
    .catch(err => {
      let message = "";
      if (err.code === "ConditionalCheckFailedException") {
        message = "MAX_VIDEOS_REACHED";
      } else {
        message = "DB_ERROR";
      }
      throw new Error(message, err);
    });
}

function putUserVideo(tableName, userId, videoId, docClient) {
  const putParams = {
    TableName: tableName,
    Key: { userId },
    Item: { userId, videos: docClient.createSet([videoId]) },
    ConditionExpression: "attribute_not_exists(userId)"
  };

  return docClient.put(putParams).promise();
}

module.exports.insertVideoStream = async (userId, videoId, tableName) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  const userVideos = await getUserVideos(tableName, userId, docClient);
  if (userVideos.length === 0) {
    return putUserVideo(tableName, userId, videoId, docClient).catch(err => {
      if (err.code === "ConditionalCheckFailedException") {
        return updateUserVideos(tableName, userId, videoId, docClient);
      }
      throw err;
    });
  }

  return updateUserVideos(tableName, userId, videoId, docClient);
};

module.exports.getVideoStreamsFromUser = async (userId, tableName) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return getUserVideos(tableName, userId, dynamoDb);
};

module.exports.removeVideoStream = (userId, videoId, tableName) => {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: tableName,
    Key: { userId },
    UpdateExpression: "DELETE videos :v",
    ExpressionAttributeValues: {
      ":v": docClient.createSet(videoId),
      ":vs": videoId
    },
    ConditionExpression: "attribute_exists(userId) and contains(videos, :vs)"
  };
  return docClient
    .update(params)
    .promise()
    .catch(err => {
      let message = "";
      if (err.code === "ConditionalCheckFailedException") {
        message = "NOT_FOUND";
      } else {
        message = "DB_ERROR";
      }
      throw new Error(message, err);
    });
};
