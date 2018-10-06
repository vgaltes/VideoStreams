const uuidv4 = require("uuid/v4");

module.exports.handler = (event, context, callback) => {
  const streamId = uuidv4();

  const response = {
    statusCode: 200,
    body: JSON.stringify({ video_id: event.body.video_id, stream_id: streamId })
  };
  callback(null, response);
};
