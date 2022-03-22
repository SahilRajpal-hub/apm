const getCpeInfo = (callback) => {
  let host = {
    server: {
      host: "192.168.38.1",
      port: "22",
      userName: "admin",
      password: "admin",
      hashMethod: "md5",
      readyTimeout: 50000,
      tryKeyboard: true,
      algorithms: {
        kex: [
          "diffie-hellman-group1-sha1",
          "ecdh-sha2-nistp256",
          "ecdh-sha2-nistp384",
          "ecdh-sha2-nistp521",
          "diffie-hellman-group-exchange-sha256",
          "diffie-hellman-group14-sha1",
        ],
        cipher: [
          "aes128-ctr",
          "aes192-ctr",
          "aes256-ctr",
          "aes128-gcm",
          "aes128-gcm@openssh.com",
          "aes256-gcm",
          "aes256-gcm@openssh.com",
          "aes256-cbc",
        ],
      },
    },
    commands: ["wan lte lteinfo"],
    msg: {
      send: function (message) {
        // console.log("message: " + message);
      },
    },
    //      verbose: true,
    //    debug: true,
    idleTimeOut: 10000,
    ["keyboard-interactive"]: function (
      name,
      instructions,
      instructionsLang,
      prompts,
      finish
    ) {
      //  console.log('Connection :: keyboard-interactive');
      //   console.log(prompts);
      finish(["admin"]);
    },
    onEnd: function (sessionText, sshObj) {
      sshObj.msg.send("--------- onEnd has ------------");
      sshObj.msg.send(sessionText);
    },
    onData: function (rawData) {
      const data = rawData.split(/\r?\n/);
      if (data.length === 4) {
        const time = data[0].split(" ")[3];
        const row1 = data[1].split(" ");
        const row2 = data[2].split(" ");
        const obj = {};
        obj["networkType"] = row1[0].match(/\((.*?)\)/)[1];
        obj["bandInfo"] = row1[1].match(/\((.*?)\)/)[1];
        obj["bandwidth"] = row1[2].match(/\((.*?)\)/)[1];
        obj["earfcnDL"] = row1[3].match(/\((.*?)\)/)[1];
        obj["pci"] = row2[0].match(/\((.*?)\)/)[1];
        obj["rsrp"] = row2[2].match(/\((.*?)\)/)[1];
        obj["rsrq"] = row2[3].match(/\((.*?)\)/)[1];
        obj["rssi"] = row2[4].match(/\((.*?)\)/)[1];
        obj["sinr"] = row2[5].match(/\((.*?)\)/)[1];
        obj["time"] = time;
        // console.log(time);
        //console.log(obj);
        callback(obj);
      }
    },
  };

  //Create a new instance
  var SSH2Shell = require("ssh2shell"),
    SSH = new SSH2Shell(host);

  //Start the process
  SSH.connect();
};

module.exports = { getCpeInfo };
