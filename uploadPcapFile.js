const mqtt = require("mqtt");
const PORT = 1883;
const { uploadpcapFile } = require("./uploadFile");
const client = mqtt.connect(`mqtt://127.0.0.1:${PORT}`);
const logger = require("./logger");

client.on("connect", () => {
  client.subscribe("deleteFile", (err) => {
    if (err) {
      throw err;
    }
  });
});

const uploadPcapFile = (filename) => {
  uploadpcapFile(filename, "application/vnd", () => {
    logger.info(`${filename} uploaded to cloud`);
    client.publish("deleteFile", filename);
  });
};

module.exports = uploadPcapFile;
