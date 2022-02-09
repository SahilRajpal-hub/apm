const fs = require('fs');

const fileProcessing = (filePath, callback) => {
    let a = new Date().getTime();
    fs.readFile(filePath + '.throughput.txt', (err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        const throughput = data.toString();
        console.log('throughput : ', throughput);
        fs.readFile(filePath + '.txt', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(filePath);
            const dataArray = data.match(/[^\s]+/g);
            let rttSum = 0;
            let refTimestamp = 0;
            let n = 0;
            if (dataArray)
                for (let i = 1; i < dataArray.length; i += 2) {
                    const packetData = JSON.parse(dataArray[i]);
                    if (packetData.layers.tcp_analysis_ack_rtt) {
                        const timestamp = Number(packetData.timestamp.substr(packetData.timestamp.length - 5));
                        const rtt = Number(packetData.layers.tcp_analysis_ack_rtt[0]) * 1000;
                        if (refTimestamp === 0) {
                            refTimestamp = timestamp;
                        }
                        if (timestamp - refTimestamp > 100) {
                            refTimestamp = timestamp;
                            console.log(`rtt and throughput for ${timestamp} is ${rttSum / n} and ${throughput} respectively`);

                            /*

                            @TODO -> create object of upload and post it on mqtt api

                            const obj = {
                                rtt: ${rttSum / n}, 
                                throughput:${throughput}, 
                                timestamp: packetData.timestamp
                            }

                            mqttUpload(obj);
                             */


                            rttSum = 0;
                            n = 0;
                        }
                        rttSum += rtt;
                        n++;
                    }
                }
            console.log("Time taken ", new Date().getTime() - a);

        });

        callback();
    })
}

module.exports = fileProcessing;