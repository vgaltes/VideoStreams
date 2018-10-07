const videoStreamRepository = require("../../lib/videoStreamRepository");
const log = require("../../lib/log");
const response = require("../../lib/response");

module.exports.handler = async (event, context, callback) => {
  const userId = event.pathParameters.user_id;

  return videoStreamRepository
    .getVideoStreamsFromUser(userId, process.env.videoStreamsTableName)
    .then(results => {
      const streams = results.Items.map(r => r.videoId);
      callback(null, response.success({ streams }));
    })
    .catch(err => {
      log.Error("Error reading video streams from the database.", userId, err);
      callback(null, response.failure(500));
    });
};
