const uuidv4 = require("uuid/v4");
const videoStreamsDb = require("../../lib/videoStreamsDb");
const listStreams = require("../../../src/functions/user/listStreams");

function callHandler(pathParameters) {
  const context = {};
  const event = {
    pathParameters
  };

  return new Promise((resolve, reject) => {
    listStreams.handler(event, context, (err, response) => {
      if (err) {
        reject(err);
      } else {
        response.body = JSON.parse(response.body);
        resolve(response);
      }
    });
  });
}

describe("Given a user is already watching some video streams", () => {
  const userId = uuidv4();
  const numberOfStreams = 2;

  beforeAll(async () => {
    // TODO: get the stage from a environment variable.
    process.env.videoStreamsTableName = "videoStreams-dev";

    await videoStreamsDb.fillUserVideoStreams(userId, numberOfStreams);
  });

  test("she should be able to get the list of streams she's watching", async () => {
    const response = await callHandler({ user_id: userId });

    expect(response.statusCode).toBe(200);
    const streams = JSON.parse(response.body);
    expect(streams.length).toBe(numberOfStreams);
  });
});
