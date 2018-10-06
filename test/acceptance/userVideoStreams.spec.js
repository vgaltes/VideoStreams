const http = require("superagent");
const uuidv4 = require("uuid/v4");

describe("Given a user is not watching any video stream", () => {
  const userId = uuidv4();
  const videoId = uuidv4();
  // TODO: get the api_url from SSM. For now, let's have it hardcoded.
  const apiBasePath =
    "https://ivgph7b9s5.execute-api.eu-west-1.amazonaws.com/dev/";

  test("she should be able to watch a new video", () => {
    const url = `${apiBasePath}/user/${userId}/stream`;
    return http
      .post(url)
      .send({ video_id: videoId })
      .set("accept", "json")
      .then(res => {
        expect(res.ok).toBe(true);
        expect(res.body).toEqual({
          video_id: videoId,
          stream_id: expect.any(String)
        });
      });
  });
});
