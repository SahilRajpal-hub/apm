const si = require("systeminformation");

const getStaticSystemInfo = (callback) => {
  //  <--- to get system information ----->
  let a = Date.now();
  si.system((data) => {
    si.osInfo((osData) => {
      const obj = {
        model: data.model,
        brand: data.manufacturer,
        device: `${osData.platform} (${osData.distro})`,
        osVersion: osData.release,
      };

      let b = Date.now();
      callback(obj);
      // console.log(obj);
      //console.log(b - a, ' ms taken to get info.');
    });
  });
};

module.exports = { getStaticSystemInfo };
