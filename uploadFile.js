const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");
const logger = require("./logger");
const storage = new Storage({
  keyFilename: "innovate5g-phoenix-key.json",
  projectId: "innovate5g-phoenix",
});

const pcapBucketname = "apm_device_pcap";
const logsBucketname = "apm_device_logs";
const kpiBucketname = "apm_device_kpi";

const fn = "uploadFile :: ";

async function uploadpcapFile(filename, mimetype, callback) {
  try {
    await storage
      .bucket(pcapBucketname)
      .upload(path.join(__dirname + "/Services/packets/" + filename), {
        destination: filename,
      });

    if (callback) {
      callback();
    }
  } catch (error) {
    logger.error(fn + error);
  }
}

async function uploadlogsFile(filename, mimetype, callback) {
  try {
    console.log(fn + "uploading " + path.join(__dirname + "/" + filename));
    await storage
      .bucket(logsBucketname)
      .upload(path.join(__dirname + "/" + filename), {
        destination: filename.slice(5),
      });

    if (callback) {
      callback();
    }
  } catch (error) {
    logger.error(fn + error);
  }
}
async function uploadkpiFile(filename, mimetype, callback) {
  try {
    await storage
      .bucket(kpiBucketname)
      .upload(path.join(__dirname + "/kpi/" + filename), {
        destination: filename,
      });

    if (callback) {
      callback();
    }
  } catch (error) {
    logger.error(fn + error);
  }
}

logger.info("gwdvhjdj");

module.exports = { uploadpcapFile, uploadkpiFile, uploadlogsFile };
