const uuidv4 = require("uuid/v4");
const stopWatchingStream = require("../../../src/functions/user/stopWatchingStream");
const listStreams = require("../../../src/functions/user/listStreams");
const videoStreamsDb = require("../../lib/videoStreamsDb");
const lambdaInvoker = require("../../lib/lambdaInvoker");

describe("Given a user has never watched any video stream", () => {
  const userId = uuidv4();
  const videoId = uuidv4();

  beforeAll(() => {
    // TODO: get the stage from a environment variable.
    process.env.videoStreamsTableName = "videoStreams-dev";
  });

  test("she should not be able to stop watching a video", async () => {
    const response = await lambdaInvoker.call(
      stopWatchingStream,
      { user_id: userId },
      { video_id: videoId }
    );

    expect(response.statusCode).toBe(404);
  });
});

describe("Given a user is watching one video stream", () => {
  const userId = uuidv4();
  let videoId = "";

  beforeAll(async () => {
    // TODO: get the stage from a environment variable.
    process.env.videoStreamsTableName = "videoStreams-dev";

    [videoId] = await videoStreamsDb.fillUserVideoStreams(userId, 1);
  });

  test("she should be able to stop watching a video one time, but not twice", async () => {
    let response = await lambdaInvoker.call(
      stopWatchingStream,
      { user_id: userId },
      { video_id: videoId }
    );
    expect(response.statusCode).toBe(200);
    response = await lambdaInvoker.call(
      stopWatchingStream,
      { user_id: userId },
      { video_id: videoId }
    );
    expect(response.statusCode).toBe(404);
    response = await lambdaInvoker.call(listStreams, { user_id: userId });
    expect(response.statusCode).toBe(200);
    expect(response.body.streams.length).toBe(0);
  });
});
