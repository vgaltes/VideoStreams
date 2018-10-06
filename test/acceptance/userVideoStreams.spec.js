const http = require("superagent");

describe("Given a user is not watching any video stream", () => {
  // TODO: create a new userId, using uuid to avoid collisions
  const userId = 1;
  // TODO: create a new videoId, using uuid to avoid collisions
  const videoId = 1;
  // get the api_url from SSM. For now, let's have it hardcoded.
  const apiBasePath = "";

  test("she should be able to watch a new video", () => {
    const url = `${apiBasePath}/user/${userId}/stream`;
    return http
      .post(url)
      .send({ user_id: userId, video_id: videoId })
      .set("accept", "json")
      .then(res => {
        expect(res.ok).toBe(true);
        expect(res.body).toEqual({ stream_id: expect.any(String) });
      });
  });
});
