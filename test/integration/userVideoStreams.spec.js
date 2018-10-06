const AWS = require("aws-sdk");
const uuidv4 = require("uuid/v4");
const watchStream = require("../../src/functions/user/watchStream");

AWS.config.update({ region: "eu-west-1" });

function callHandler(body, pathParameters) {
  const context = {};
  const event = {
    body: JSON.stringify(body),
    pathParameters
  };

  return new Promise((resolve, reject) => {
    watchStream.handler(event, context, (err, response) => {
      if (err) {
        reject(err);
      } else {
        response.body = JSON.parse(response.body);
        resolve(response);
      }
    });
  });
}

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

async function fillUserVideoStreams(userId) {
  return Promise.all([
    insertVideoStream(userId, uuidv4()),
    insertVideoStream(userId, uuidv4()),
    insertVideoStream(userId, uuidv4())
  ]);
}

describe("Given a user is not watching any video stream", () => {
  const userId = uuidv4();
  const videoId = uuidv4();

  beforeAll(() => {
    // TODO: retrieve from SSM. Probably refactor to another file.
    process.env.videoStreamsTableName = "videoStreams-dev";
  });

  test("she should be able to watch a new video", async () => {
    const response = await callHandler(
      { video_id: videoId },
      { user_id: userId }
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      video_id: videoId
    });
  });
});

describe("Given a user is already watching three video streams", () => {
  const userId = uuidv4();
  const videoId = uuidv4();

  beforeAll(async () => {
    // TODO: retrieve from SSM. Probably refactor to another file.
    process.env.videoStreamsTableName = "videoStreams-dev";

    await fillUserVideoStreams(userId);
  });

  test("she shouldn't be able to watch a new video", async () => {
    const response = await callHandler(
      { video_id: videoId },
      { user_id: userId }
    );

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      message: "User watching too many video streams."
    });
  });
});
