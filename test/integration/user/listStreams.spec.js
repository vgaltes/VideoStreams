const uuidv4 = require("uuid/v4");
const videoStreamsDb = require("../../lib/videoStreamsDb");
const listStreams = require("../../../src/functions/user/listStreams");
const lambdaInvoker = require("../../lib/lambdaInvoker");

describe("Given a user is already watching some video streams", () => {
  const userId = uuidv4();
  const numberOfStreams = 2;

  beforeAll(async () => {
    // TODO: get the stage from a environment variable.
    process.env.videoStreamsTableName = "videoStreams-dev";

    await videoStreamsDb.fillUserVideoStreams(userId, numberOfStreams);
  });

  test("she should be able to get the list of streams she's watching", async () => {
    const response = await lambdaInvoker.call(listStreams, { user_id: userId });

    expect(response.statusCode).toBe(200);
    expect(response.body.streams.length).toBe(numberOfStreams);
  });
});
