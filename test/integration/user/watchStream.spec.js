const uuidv4 = require("uuid/v4");
const watchStream = require("../../../src/functions/user/watchStream");
const listStreams = require("../../../src/functions/user/listStreams");
const videoStreamsDb = require("../../lib/videoStreamsDb");
const lambdaInvoker = require("../../lib/lambdaInvoker");

const MAX_STREAMS = 3;
const aboutToReachMaxStreams = 2;

describe("Given a user is not watching any video stream", () => {
  const userId = uuidv4();
  const videoId = uuidv4();

  beforeAll(() => {
    // TODO: get the stage from a environment variable.
    process.env.videoStreamsTableName = "videoStreams-dev";
  });

  test("she should be able to watch a new video", async () => {
    const response = await lambdaInvoker.call(
      watchStream,
      { user_id: userId },
      { video_id: videoId }
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      video_id: videoId
    });
  });
});

describe("Given a user is already about to reach the maximum number of streams", () => {
  const userId = uuidv4();
  const videoId = uuidv4();

  beforeAll(async () => {
    // TODO: get the stage from a environment variable.
    process.env.videoStreamsTableName = "videoStreams-dev";

    await videoStreamsDb.fillUserVideoStreams(userId, aboutToReachMaxStreams);
  });

  test("she should be able to watch a new video, but not another one", async () => {
    let response = await lambdaInvoker.call(
      watchStream,
      { user_id: userId },
      { video_id: videoId }
    );
    expect(response.statusCode).toBe(200);

    response = await lambdaInvoker.call(
      watchStream,
      { user_id: userId },
      { video_id: uuidv4() }
    );
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      message: "User watching too many video streams."
    });

    response = await lambdaInvoker.call(listStreams, { user_id: userId });
    expect(response.statusCode).toBe(200);
    expect(response.body.streams.length).toBe(MAX_STREAMS);
  });
});
