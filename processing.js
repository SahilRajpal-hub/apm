const fs = require("fs");
const logger = require("./logger");
const fn = "processing :: ";

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function roundToTwoPoints(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function throughputSanitizer(thrput) {
  let thrpt = thrput.split("\n")[0];
  if (thrpt.substr(thrpt.length - 4) === "kbps") {
    const thrptNumber = Number(thrpt.slice(0, -4));
    thrptNumber = thrptNumber / 1024;
    return thrptNumber;
  } else {
    return Number(thrpt.slice(0, -4));
  }
}

const fileProcessing = (filePath, uploadFileToCloud, uploadKpis) => {
  let a = new Date().getTime();
  fs.readFile(filePath + ".throughput.txt", (err, data) => {
    if (err) {
      logger.error(fn + err);
      throw err;
    }
    const throughput = throughputSanitizer(data.toString());
    logger.info(fn + "throughput : " + throughput);
    fs.readFile(filePath + ".txt", "utf8", (err, data) => {
      if (err) {
        logger.error(fn + err);
        throw err;
      }
      logger.info(fn + filePath);
      const dataArray = data.match(/[^\s]+/g);
      let rttSum = 0;
      let refTimestamp = 0;
      let n = 0;
      if (dataArray) {
        for (let i = 1; i < dataArray.length; i += 2) {
          const packetData = JSON.parse(dataArray[i]);
          if (packetData.layers.tcp_analysis_ack_rtt) {
            const rtt =
              Number(packetData.layers.tcp_analysis_ack_rtt[0]) * 1000;
            rttSum += rtt;
            n++;
          }
        }
      }
      uploadKpis({ rtt: rttSum, throughput: throughput });
      uploadFileToCloud();
      logger.info(fn + "Time taken " + new Date().getTime() - a);
    });
  });
};

module.exports = fileProcessing;
