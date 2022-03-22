const winston = require("winston");
const dailyRotateFile = require("winston-daily-rotate-file");
const { uploadlogsFile } = require("./uploadFile");
const path = require("path");
const fs = require("fs");

const logDir = "logs"; // directory path you want to set
if (!fs.existsSync(logDir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(logDir);
}

const transport = new dailyRotateFile({
  filename: path.join(logDir, "apmlogs-%DATE%.log"),
  frequency: "1m",
  datePattern: "YYYY-MM-DD-HH-mm",
  // maxSize: "40m",
  // maxFiles: "0.5h",
});

transport.on("rotate", (oldFilename, newFilename) => {
  console.log("uploading ", oldFilename);
  uploadFile(oldFilename, "text/plain", () => {
    fs.unlink(path.join(logDir + oldFilename));
  });
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [transport],
});

module.exports = logger;
// let a = 1;

// setInterval(() => {
//   logger.info("This is continous log");
//   a++;
//   logger.info("This is dynamic log ", a);
// }, 200);
