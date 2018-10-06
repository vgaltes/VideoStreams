const uuidv4 = require("uuid/v4");
const watchStream = require("../../../src/functions/user/watchStream");
const videoStreamsDb = require("../../lib/videoStreamsDb");

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

describe("Given a user is not watching any video stream", () => {
  const userId = uuidv4();
  const videoId = uuidv4();

  beforeAll(() => {
    // TODO: get the stage from a environment variable.
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

describe("Given a user is already watching two video streams", () => {
  const userId = uuidv4();
  const videoId = uuidv4();

  beforeAll(async () => {
    // TODO: get the stage from a environment variable.
    process.env.videoStreamsTableName = "videoStreams-dev";

    await videoStreamsDb.fillUserVideoStreams(userId, 2);
  });

  test("she should be able to watch a new video, but not another one", async () => {
    let response = await callHandler(
      { video_id: videoId },
      { user_id: userId }
    );
    expect(response.statusCode).toBe(200);

    response = await callHandler({ video_id: uuidv4() }, { user_id: userId });
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      message: "User watching too many video streams."
    });
  });
});
