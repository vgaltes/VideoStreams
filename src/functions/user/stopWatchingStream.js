const videoStreamRepository = require("../../lib/videoStreamRepository");
const log = require("../../lib/log");
const response = require("../../lib/response");

module.exports.handler = async (event, context, callback) => {
  const userId = event.pathParameters.user_id;
  const req = JSON.parse(event.body);

  return videoStreamRepository
    .removeVideoStream(userId, req.video_id, process.env.videoStreamsTableName)
    .then(() => {
      callback(null, response.success({ video_id: req.video_id }));
    })
    .catch(err => {
      log.error("Error removing user videos.", userId, req.video_id, err);
      if (err.message === "NOT_FOUND") callback(null, response.failure(404));
      else callback(null, response.failure(500));
    });
};
