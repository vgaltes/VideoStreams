const uuidv4 = require("uuid/v4");
const videoStreamsDb = require("../../lib/videoStreamsDb");
const httpInvoker = require("../../lib/httpInvoker");

const apiBasePath = process.env.API_BASE_PATH;

describe("Given a user is already watching some video streams", () => {
  const userId = uuidv4();
  const numberOfStreams = 2;

  beforeAll(async () => {
    // TODO: get the stage from a environment variable.
    process.env.videoStreamsTableName = "videoStreams-dev";

    await videoStreamsDb.fillUserVideoStreams(userId, numberOfStreams);
  });

  test("she should be able to get the list of streams she's watching", async () => {
    const url = `${apiBasePath}/user/${userId}/streams`;
    return httpInvoker.call(url, "GET").then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.streams.length).toBe(numberOfStreams);
    });
  });
});
