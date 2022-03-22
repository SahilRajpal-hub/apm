const mqtt = require("mqtt");
const aedes = require("aedes")();
const fs = require("fs");
const server = require("net").createServer(aedes.handle);
const fileProcessing = require("./processing");
const { getStaticSystemInfo } = require("./systemInformation.js");
const { getCpeInfo } = require("./sshcpe.js");
const uploadPcapFile = require("./uploadPcapFile");
const { uploadkpiFile } = require("./uploadFile");
const PORT = 1883;

let infoObj = {};

server.listen(PORT, function () {
  console.log("Aedes server started and listening on port ", PORT);
  const client = mqtt.connect(`mqtt://127.0.0.1:${PORT}`);
  client.on("connect", function () {
    console.log("Connection with mqtt Protocol established");
    getStaticSystemInfo((obj) => {
      infoObj = { ...infoObj, ...obj };
    });

    getCpeInfo((obj) => {
      infoObj = { ...infoObj, ...obj };
    });

    client.subscribe("packetdata", function (err) {
      if (err) {
        throw err;
      }
    });
    client.subscribe("deleteFile", function (err) {
      if (err) {
        throw err;
      }
    });

    client.on("message", (topic, message) => {
      console.log(topic);
      if (topic === "packetdata") {
        const filename = message.toString();
        fileProcessing(
          __dirname + "/Services/stats/" + filename,
          () => {
            uploadPcapFile(filename);
          },
          (data) => {
            infoObj = { ...infoObj, ...data };
            let filename = `kpi_${Date.now()}`;
            fs.writeFile(
              path.join(__dirname + "/kpi/" + filename),
              JSON.stringify(infoObj),
              "utf-8",
              () => {
                uploadkpiFile(filename, "text/plain");
                logger.info(fn + filename + " kpi file uploaded");
              }
            );
            console.log(infoObj);
          }
        );
      }

      if (topic === "deleteFile") {
        const filename = message.toString();
        const filePcapPath = __dirname + "/Services/packets/" + filename;
        const fileStatPcapPath =
          __dirname + "/Services/stats/" + filename + ".txt";
        const fileStatThrouhputPath =
          __dirname + "/Services/stats/" + filename + ".throughput.txt";
        fs.unlink(filePcapPath, (err) => {
          if (err) {
            console.log(err);
            throw err;
          }
        });
        fs.unlink(fileStatPcapPath, (err) => {
          if (err) {
            console.log(err);
            throw err;
          }
        });
        fs.unlink(fileStatThrouhputPath, (err) => {
          if (err) {
            console.log(err);
            throw err;
          }
        });
      }
    });
  });
});
