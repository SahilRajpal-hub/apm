const fs = require('fs');
const util = require('./util');
const os = require('os');
const si = require('systeminformation');

function memInfo(callback) {
    let result = {};
    let a = Date.now();
    fs.readFile('/proc/meminfo', function (error, stdout) {
        if (!error) {
            const lines = stdout.toString().split('\n');
            // console.log(lines)
            result.total = parseInt(util.getValue(lines, 'memtotal'), 10);
            // result.total = result.total ? result.total * 1024 : os.totalmem();
            result.free = parseInt(util.getValue(lines, 'memfree'), 10);
            // result.free = result.free ? result.free * 1024 : os.freemem();
            result.used = result.total - result.free;

            result.buffers = parseInt(util.getValue(lines, 'buffers'), 10);
            // result.buffers = result.buffers ? result.buffers * 1024 : 0;
            result.cached = parseInt(util.getValue(lines, 'cached'), 10);
            // result.cached = result.cached ? result.cached * 1024 : 0;
            result.slab = parseInt(util.getValue(lines, 'slab'), 10);
            // result.slab = result.slab ? result.slab * 1024 : 0;
            result.buffcache = result.buffers + result.cached + result.slab;

            result.available = parseInt(util.getValue(lines, 'memavailable'), 10);
            // result.available = result.available ? result.available * 1024 : result.free + result.buffcache;
            result.active = result.total - result.available;

            result.swaptotal = parseInt(util.getValue(lines, 'swaptotal'), 10);
            // result.swaptotal = result.swaptotal ? result.swaptotal * 1024 : 0;
            result.swapfree = parseInt(util.getValue(lines, 'swapfree'), 10);
            // result.swapfree = result.swapfree ? result.swapfree * 1024 : 0;
            result.swapused = result.swaptotal - result.swapfree;
        }
        // { total: result.total, used: result.active, free: result.available }
        if (callback) { callback(result.active * 100 / result.total); }
    });
}

function infoOfServices(callback) {
    si.services('*', services => {
        let cpu = 0, mem = 0;
        for (let serviceIndex in services) {
            const service = services[serviceIndex];
            cpu += service.cpu;
            mem += service.mem;
            if (service.name === "anydesk") {
                console.log({ name: service.name, cpu: service.cpu, mem: service.mem });
            }
        }
        console.log(cpu);
        console.log(mem);
    })
}

module.exports = { memInfo, infoOfServices }

memInfo(data => console.log(data));
infoOfServices()