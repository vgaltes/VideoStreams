const uuidv4 = require("uuid/v4");
const httpInvoker = require("../../lib/httpInvoker");
const videoStreamsDb = require("../../lib/videoStreamsDb");

const apiBasePath = process.env.API_BASE_PATH;
const MAX_STREAMS = 3;
const aboutToReachMaxStreams = 2;

describe("Given a user is not watching any video stream", () => {
  const userId = uuidv4();
  const videoId = uuidv4();

  test("she should be able to watch a new video", () => {
    const url = `${apiBasePath}/user/${userId}/stream`;
    return httpInvoker.call(url, "POST", { video_id: videoId }).then(res => {
      expect(res.ok).toBe(true);
      expect(res.body).toEqual({ video_id: videoId });
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
    const watchUrl = `${apiBasePath}/user/${userId}/stream`;
    const listUrl = `${apiBasePath}/user/${userId}/streams`;
    await httpInvoker
      .call(watchUrl, "POST", {
        video_id: videoId
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
      });

    await httpInvoker
      .call(watchUrl, "POST", {
        video_id: uuidv4()
      })
      .catch(err => {
        expect(err.response.statusCode).toBe(403);
        expect(err.response.body).toEqual({
          message: "User watching too many video streams."
        });
      });

    return httpInvoker.call(listUrl, "GET").then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.streams.length).toBe(MAX_STREAMS);
    });
  });
});
