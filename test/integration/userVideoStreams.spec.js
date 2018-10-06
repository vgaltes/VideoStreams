const uuidv4 = require("uuid/v4");
const watchStream = require("../../src/functions/user/watchStream");

function callHandler(body, pathParameters) {
  const context = {};
  const event = {
    body,
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

  test("she should be able to watch a new video", async () => {
    const response = await callHandler(
      {
        video_id: videoId
      },
      {
        user_id: userId
      }
    );

    expect(response.body).toEqual({
      video_id: videoId,
      stream_id: expect.any(String)
    });
  });
});

describe("Given a user is already watching three video streams", () => {
  const userId = uuidv4();
  const videoId = uuidv4();
  // publish data into dynamodb
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
