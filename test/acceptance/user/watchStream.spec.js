const http = require("superagent");
const uuidv4 = require("uuid/v4");
const videoStreamsDb = require("../../lib/videoStreamsDb");

// TODO: we can pass this via environment variables
const apiBasePath =
  "https://8yocvbb1xb.execute-api.eu-west-1.amazonaws.com/dev/";

function callHttp(url, verb, body) {
  const request = http(verb, url).set("accept", "json");

  if (body) {
    request.send(JSON.stringify(body));
  }

  return request;
}

describe("Given a user is not watching any video stream", () => {
  const userId = uuidv4();
  const videoId = uuidv4();

  test("she should be able to watch a new video", () => {
    const url = `${apiBasePath}/user/${userId}/stream`;
    return callHttp(url, "POST", { video_id: videoId }).then(res => {
      expect(res.ok).toBe(true);
      expect(res.body).toEqual({
        video_id: videoId
      });
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
    const watchUrl = `${apiBasePath}/user/${userId}/stream`;
    const listUrl = `${apiBasePath}/user/${userId}/streams`;
    await callHttp(watchUrl, "POST", { video_id: videoId }).then(response => {
      expect(response.statusCode).toBe(200);
    });

    await callHttp(watchUrl, "POST", { video_id: uuidv4() }).catch(err => {
      expect(err.response.statusCode).toBe(403);
      expect(err.response.body).toEqual({
        message: "User watching too many video streams."
      });
    });

    return callHttp(listUrl, "GET")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.streams.length).toBe(3);
      })
      .catch(error => {
        console.log(error);
      });
  });
});
