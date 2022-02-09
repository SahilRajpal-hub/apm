const mqtt = require('mqtt');
const PORT = 1883;
const client = mqtt.connect(`mqtt://127.0.0.1:${PORT}`);

client.on('connect', () => {
    client.subscribe('deleteFile', (err) => {
        if (err) {
            throw err;
        }
    })
})

const uploadPcapFile = (filename) => {
    console.log(`Uploading ${filename} file to cloud`); // will be changing with upload link in future
    client.publish('deleteFile', filename);
}

module.exports = uploadPcapFile;