console.log(throughputSanitizer("12kbps\n12kbps"));

function throughputSanitizer(thrput) {
  let thrpt = thrput.split("\n")[0];
  if (thrpt.substr(thrpt.length - 4) === "kbps") {
    let thrptNumber = Number(thrpt.slice(0, -4));
    thrptNumber = thrptNumber / 1024;
    return thrptNumber;
  } else {
    return Number(thrpt.slice(0, -4));
  }
}
