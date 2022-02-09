const mqtt = require('mqtt');
const aedes = require('aedes')();
const fs = require('fs');
const server = require('net').createServer(aedes.handle);
const fileProcessing = require('./processing');
const uploadPcapFile = require('./uploadPcapFile');
const PORT = 1883;


server.listen(PORT, function () {
    console.log('Aedes server started and listening on port ', PORT);
    const client = mqtt.connect(`mqtt://127.0.0.1:${PORT}`);
    client.on('connect', function () {
        console.log('Connection with mqtt Protocol established');
        client.subscribe('packetdata', function (err) {
            if (err) {
                throw err;
            }
        });
        client.subscribe('deleteFile', function (err) {
            if (err) {
                throw err;
            }
        });

        client.on('message', (topic, message) => {
            console.log(topic);
            if (topic === 'packetdata') {
                const filename = message.toString();
                fileProcessing(__dirname + '/Services/stats/' + filename, () => {
                    uploadPcapFile(filename);
                });

            }

            if (topic === 'deleteFile') {
                const filename = message.toString();
                const filePcapPath = __dirname + '/Services/packets/' + filename;
                const fileStatPcapPath = __dirname + '/Services/stats/' + filename + '.txt';
                const fileStatThrouhputPath = __dirname + '/Services/stats/' + filename + '.throughput.txt';
                fs.unlink(filePcapPath, (err) => {
                    if (err) {
                        console.log(err)
                        throw err;
                    }
                });
                fs.unlink(fileStatPcapPath, (err) => {
                    if (err) {
                        console.log(err)
                        throw err;
                    }
                });
                fs.unlink(fileStatThrouhputPath, (err) => {
                    if (err) {
                        console.log(err)
                        throw err;
                    }
                });
            }
        });
    })
});




