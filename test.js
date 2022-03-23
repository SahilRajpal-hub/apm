const si = require("systeminformation");

// si.mem().then((data) => console.log(data.used / data.total));
si.mem().then((data) => console.log(data));
// si.processes((d) => {
//   const data = d.list;
//   const a = Date.now();
//   let cpuUtilization = 0;
//   let ramUtilization = 0;
//   for (let i in data) {
//     console.log(data[i].name + " --> " + data[i].cpu);

//     cpuUtilization += data[i].cpu;
//     ramUtilization += data[i].mem;
//   }
//   //   <----------- cpu utilization individual ---------->
//   console.log("cpu utilization " + cpuUtilization);

//   console.log("ram utilization " + ramUtilization);
//   console.log(Date.now() - a);

//   //   <----------- memory utilization total ---------->
//   // si.mem().then((data) => console.log(data));

//   //   <----------- cpu utilization total ---------->
//   // var os = require("os-utils");
//   // os.cpuUsage(function (v) {
//   //   console.log("CPU Usage (%): " + v);
//   // });
// });

var os = require('os');
let a = os.freemem();
let b = os.totalmem();

console.log(a+" "+b);