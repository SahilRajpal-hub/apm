const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://127.0.0.1:3000");
const generator = require("pcap-generator");
const fs = require("fs");
const pcap = require("pcap");

const listener = () => {
  let currentTimeReference = 0;
  let packetBatchPerSec = [];

  client.on("connect", () => {
    console.log("Listener connected to the queue");
    client.subscribe("packetdata", (err) => {
      if (err) {
        throw err;
      }
      client.on("message", (topic, message) => {
        if (topic === "packetdata") {
          // console.log(JSON.parse(message))
          const packet = JSON.parse(message);
          if (packet.pcap_header.tv_sec > currentTimeReference) {
            console.log(packet.pcap_header);
            currentTimeReference = packet.pcap_header.tv_sec;
            pushPacketBatchToCloud(packetBatchPerSec);
            packetBatchPerSec = [];
          }
          packetBatchPerSec.push(packet);
        }
      });
    });
  });
};

const pushPacketBatchToCloud = (packets) => {
  let currentTimeReferenceInUsec = 0;
  let batchInUSec = [];
  for (let i = 0; i < packets.length; i++) {
    if (packets[i].pcap_header.tv_usec - currentTimeReferenceInUsec > 100000) {
      currentTimeReferenceInUsec = packets[i].pcap_header.tv_usec;
      if (batchInUSec.length !== 0) {
        console.log(batchInUSec); // later will send to network
        // const pcapFile = generator(batchInUSec);
        // fs.readFileSync(`test${i}.pcap`, pcapFile);
        batchInUSec = [];
      }
    }
    batchInUSec.push();
  }
};

module.exports = listener;
